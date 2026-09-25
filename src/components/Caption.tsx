import React from "react";
import { THEME } from "../theme";

/**
 * Burned-in caption renderer.
 *
 * Five real bugs shipped from earlier builds and are fixed deliberately here.
 * Read before editing:
 *
 *  1. Multi-word highlights broke into one chip per word.
 *     Fixed: the line is split on whole PHRASES, longest first, so
 *     "missed call text back" is a single chip.
 *  2. The accent colour silently failed on any word ending in a period.
 *     Fixed: matching is done on a punctuation-stripped copy while the
 *     rendered text keeps its punctuation.
 *  3. A highlighted word scaled up and collided with its neighbours.
 *     Fixed: highlights use colour, weight and a padded chip. No transform
 *     scale on inline text, ever.
 *  4. Empty spans from a zero-length split consumed flex layout and pushed
 *     the line off centre. Fixed: zero-length segments are dropped.
 *  5. Captions duplicated the on-screen headline word for word. That is
 *     prevented in Scenes.tsx (labels are short and never restate the line),
 *     not here.
 */

const stripPunct = (s: string) =>
  s.toLowerCase().replace(/[.,!?;:"'()]/g, "").trim();

type Seg = { text: string; hit: boolean };

export const segment = (line: string, phrases: string[]): Seg[] => {
  // Longest phrase first so "missed call text back" wins over "missed call".
  const ordered = [...phrases]
    .map((p) => stripPunct(p))
    .filter(Boolean)
    .sort((a, b) => b.split(" ").length - a.split(" ").length);

  const words = line.split(/\s+/).filter(Boolean);
  const segs: Seg[] = [];
  let i = 0;

  while (i < words.length) {
    let matched = 0;
    for (const phrase of ordered) {
      const n = phrase.split(" ").length;
      if (i + n > words.length) continue;
      const window = words
        .slice(i, i + n)
        .map(stripPunct)
        .join(" ");
      if (window === phrase) {
        matched = n;
        break;
      }
    }
    if (matched > 0) {
      segs.push({ text: words.slice(i, i + matched).join(" "), hit: true });
      i += matched;
    } else {
      const prev = segs[segs.length - 1];
      if (prev && !prev.hit) prev.text += " " + words[i];
      else segs.push({ text: words[i], hit: false });
      i += 1;
    }
  }
  // Bug 4: never emit empty segments into the flex row.
  return segs.filter((s) => s.text.trim().length > 0);
};

/** Long lines get a smaller face. A 27-word hook at 60px is five rendered
 *  lines, which overflowed the caption band and printed straight over the
 *  cards above it. */
const fontFor = (line: string) => {
  const n = line.length;
  if (n > 150) return 46;
  if (n > 110) return 52;
  return 60;
};

export const Caption: React.FC<{ line: string; highlights: string[] }> = ({
  line,
  highlights,
}) => {
  const segs = segment(line, highlights);
  const fontSize = fontFor(line);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        gap: "0 14px",
        rowGap: 18,
        textAlign: "center",
        fontFamily: THEME.body,
        fontWeight: 700,
        fontSize,
        lineHeight: 1.35,
        color: THEME.white,
        textShadow: "0 4px 24px rgba(0,0,0,0.65)",
      }}
    >
      {segs.map((s, idx) =>
        s.hit ? (
          <span
            key={idx}
            style={{
              display: "inline-block",
              color: THEME.navyDeep,
              background: THEME.cyan,
              borderRadius: 14,
              padding: "2px 16px 8px",
              textShadow: "none",
              whiteSpace: "nowrap",
            }}
          >
            {s.text}
          </span>
        ) : (
          // Bug 6: a whole run of plain text rendered as ONE inline-block
          // could not wrap around a chip, so every highlight was forced onto
          // its own row and the caption read as a staircase. Plain text is
          // emitted word by word so the flex row flows around the chips.
          s.text.split(" ").filter(Boolean).map((w, j) => (
            <span key={`${idx}-${j}`} style={{ display: "inline-block" }}>
              {w}
            </span>
          ))
        )
      )}
    </div>
  );
};
