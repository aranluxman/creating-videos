#!/usr/bin/env python3
"""
Map the known script lines onto the real audio and write src/captions.ts.

Whisper is not used: the words are already known, so recognition is not the
problem. What is needed is WHERE the line boundaries fall, and the TTS input
puts a paragraph break between every line, so the longest silences in the
render are exactly those boundaries.

Method:
  1. ffmpeg silencedetect finds every pause. Sentence-internal pauses are in
     there too, so simply taking the N-1 LONGEST does not work: on the first
     real run that put two boundaries inside the opening line and squeezed
     line 3 to 0.23x its expected length.
  2. A DP partition picks which N-1 pauses are the real boundaries, by
     minimising how far each resulting segment lands from that line's share
     of the words. Longer pauses get a small bonus to break ties.
  3. Sanity-check the winner: each segment's share of the runtime against
     that line's share of the words. A boundary in the wrong place shows up
     immediately as a segment far off its expected length.

Never trust estimated timings. This script is the only thing allowed to set
TIMINGS_ARE_MEASURED = true.
"""
import json
import os
import re
import subprocess
import sys

AUDIO = sys.argv[1] if len(sys.argv) > 1 else "public/voiceover.mp3"
OUT = "src/captions.ts"
NOISE_DB = "-30dB"
MIN_SILENCE = 0.16
# A segment may run this far from its word-count share before we call it wrong.
LOW, HIGH = 0.45, 2.10


def die(msg):
    sys.exit(f"align: {msg}")


def read_lines():
    src = open("src/script.ts").read()
    client = re.search(r'restaurant:\s*"([^"]+)"', src).group(1)
    gym = re.search(r'gym:\s*"([^"]+)"', src).group(1)
    which = re.search(r"export const CLIENT_NAME:\s*string\s*=\s*CLIENTS\.(\w+)", src).group(1)
    name = client if which == "restaurant" else gym
    body = re.search(r"export const SCRIPT = `(.*?)`\.trim\(\)", src, re.S).group(1)
    body = body.replace("${CLIENT_NAME}", name).strip()
    return [re.sub(r"\s+", " ", l).strip() for l in re.split(r"\n\s*\n", body) if l.strip()]


def duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", path],
        capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def silences(path):
    p = subprocess.run(
        ["ffmpeg", "-i", path, "-af",
         f"silencedetect=noise={NOISE_DB}:d={MIN_SILENCE}", "-f", "null", "-"],
        capture_output=True, text=True)
    log = p.stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    out = []
    for s, e in zip(starts, ends):
        if e > s:
            out.append((s, e))
    return out


def dp_partition(cand, words, total):
    """Pick len(words)-1 boundaries out of the candidate pauses.

    Cost of a segment is its squared relative deviation from the share of the
    runtime that line's word count says it deserves. A small credit for pause
    length breaks ties toward the more emphatic pause, which is usually the
    paragraph break.
    """
    n, m = len(words), len(cand)
    if m < n - 1:
        die(f"only {m} candidate pauses for {n-1} boundaries")
    wtot = sum(words)
    exp = [total * w / wtot for w in words]
    longest = max((d for _, d in cand), default=1.0) or 1.0

    def seg_cost(a, b, k):
        d = b - a
        if d <= 0.05:
            return 1e9
        return ((d - exp[k]) / exp[k]) ** 2

    INF = float("inf")
    # best[k][j] = cost of placing boundary k (1-based) at candidate j
    best = [[INF] * m for _ in range(n)]
    back = [[-1] * m for _ in range(n)]
    for j in range(m):
        best[1][j] = seg_cost(0.0, cand[j][0], 0) - 0.15 * (cand[j][1] / longest)
    for k in range(2, n):
        for j in range(k - 1, m):
            for i in range(k - 2, j):
                if best[k - 1][i] == INF:
                    continue
                c = best[k - 1][i] + seg_cost(cand[i][0], cand[j][0], k - 1)
                if c < best[k][j]:
                    best[k][j] = c
                    back[k][j] = i
        for j in range(m):
            if best[k][j] < INF:
                best[k][j] -= 0.15 * (cand[j][1] / longest)

    end, bestc = -1, INF
    for j in range(n - 2, m):
        if best[n - 1][j] == INF:
            continue
        c = best[n - 1][j] + seg_cost(cand[j][0], total, n - 1)
        if c < bestc:
            bestc, end = c, j
    if end < 0:
        die("no valid partition of the detected pauses")

    idx, k = [], n - 1
    j = end
    while k >= 1:
        idx.append(j)
        j = back[k][j]
        k -= 1
    idx.reverse()
    return [cand[i][0] for i in idx], [cand[i] for i in idx]


def main():
    if not os.path.exists(AUDIO):
        die(f"{AUDIO} not found. Run the voiceover step first.")
    lines = read_lines()
    n = len(lines)
    total = duration(AUDIO)
    pauses = silences(AUDIO)
    if len(pauses) < n - 1:
        die(f"only {len(pauses)} pauses detected but {n-1} boundaries are "
            f"needed. The voiceover may have been generated per line instead "
            f"of as one take.")

    words = [len(l.split()) for l in lines]
    wtot = sum(words)
    cand = [((s + e) / 2, e - s) for s, e in pauses]
    cand.sort(key=lambda c: c[0])
    cuts, ranked = dp_partition(cand, words, total)

    bounds = [0.0] + cuts + [total]
    segs = [(bounds[i], bounds[i + 1]) for i in range(n)]

    # --- pause sanity check -------------------------------------------------
    print(f"align: {n} lines, {total:.2f}s audio, "
          f"{len(pauses)} pauses detected, {n-1} used as boundaries")
    worst = 0.0
    for i, ((s, e), w) in enumerate(zip(segs, words), 1):
        expected = total * w / wtot
        actual = e - s
        ratio = actual / expected
        worst = max(worst, abs(1 - ratio))
        flag = "" if LOW <= ratio <= HIGH else "   <-- OFF"
        print(f"  line {i}: {s:6.2f} -> {e:6.2f}  {actual:5.2f}s  "
              f"expected {expected:5.2f}s  ratio {ratio:4.2f}{flag}")
        if not (LOW <= ratio <= HIGH):
            die(f"line {i} is {ratio:.2f}x its expected length. The longest "
                f"pauses did not land on the paragraph breaks, so the "
                f"alignment is wrong. Do not render on these timings.")
    used = [f"{d:.2f}s" for _, d in ranked]
    print(f"align: boundary pauses = {', '.join(used)}")
    print(f"align: pause sanity check PASSED (worst deviation "
          f"{worst*100:.0f}%, tolerance {int((HIGH-1)*100)}%)")

    timings = [{"start": round(s, 3), "end": round(e, 3)} for s, e in segs]
    with open(OUT, "w") as f:
        f.write(
            "/**\n"
            " * GENERATED by scripts/align.py. Do not hand-edit.\n"
            " * Timings are measured against the real voiceover, not estimated.\n"
            " */\n"
            "export const TIMINGS_ARE_MEASURED = true;\n"
            f"export const AUDIO_DURATION = {total:.3f};\n"
            "export const TIMINGS: { start: number; end: number }[] =\n"
            f"{json.dumps(timings, indent=2)};\n"
        )
    print(f"align: wrote {OUT} (TIMINGS_ARE_MEASURED = true)")


if __name__ == "__main__":
    main()
