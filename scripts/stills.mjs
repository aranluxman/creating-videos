/**
 * One still per scene, taken at the midpoint of that scene, plus a contact
 * sheet. The stills exist to be LOOKED AT. Every layout bug this pipeline has
 * ever shipped passed typecheck and passed code review, and was obvious in a
 * single frame.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { TIMINGS } from "../src/captions.ts";

const FPS = 30;
fs.rmSync("out/stills", { recursive: true, force: true });
fs.mkdirSync("out/stills", { recursive: true });

TIMINGS.forEach((t, i) => {
  const frame = Math.round(((t.start + t.end) / 2) * FPS);
  const file = `out/stills/scene-${String(i + 1).padStart(2, "0")}.png`;
  execFileSync(
    "npx",
    ["remotion", "still", "src/index.ts", "IAVideo", file,
     "--frame", String(frame), "--log", "error"],
    { stdio: "inherit" }
  );
  console.log(`stills: scene ${i + 1} @ frame ${frame} -> ${file}`);
});

const cols = Math.min(4, TIMINGS.length);
const rows = Math.ceil(TIMINGS.length / cols);
execFileSync(
  "ffmpeg",
  ["-y", "-v", "error", "-pattern_type", "glob", "-i", "out/stills/scene-*.png",
   "-filter_complex", `scale=360:-1,tile=${cols}x${rows}:padding=8:color=0x333333`,
   "-frames:v", "1", "out/contact-sheet.png"],
  { stdio: "inherit" }
);
console.log("stills: contact sheet -> out/contact-sheet.png");
