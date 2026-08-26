#!/usr/bin/env bash
# Prove the narration actually landed in the file and is not silence.
#
# Three probes, because a mux can fail three different ways and still exit 0:
#   lead-in  - audio present from the start (a bad offset shows up as silence)
#   mid      - the body of the video is not a dropout
#   tail     - the audio was not truncated by -shortest
set -euo pipefail
F="${1:-out/FINAL.mp4}"
[ -f "$F" ] || { echo "verify_mux: $F missing"; exit 1; }

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F")

rms () {
  ffmpeg -v error -ss "$1" -t "$2" -i "$F" -map 0:a -af astats=metadata=1 \
    -f null - 2>&1 | grep -m1 "RMS level dB" | awk '{print $NF}'
}

LEAD=$(rms 0 2)
MID=$(rms "$(python3 -c "print(max(0,$DUR/2-2))")" 4)
TAIL=$(rms "$(python3 -c "print(max(0,$DUR-3))")" 3)

echo "verify_mux: duration=${DUR}s lead-in=${LEAD}dB mid=${MID}dB tail=${TAIL}dB"

python3 - "$LEAD" "$MID" "$TAIL" <<'PY'
import sys
def f(x):
    try: return float(x)
    except: return -999.0
lead, mid, tail = map(f, sys.argv[1:4])
bad = []
if lead < -60: bad.append(f"lead-in silent ({lead} dB) - audio offset is wrong")
if mid  < -50: bad.append(f"mid-video silent ({mid} dB) - narration dropped out")
if tail < -60: bad.append(f"tail silent ({tail} dB) - audio was truncated")
if bad: sys.exit("verify_mux: " + "; ".join(bad))
print("verify_mux: OK")
PY
