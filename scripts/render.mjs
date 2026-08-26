/**
 * Render the composition in chunks and concat.
 *
 * This container has 2 cores. A single full-length render at default
 * concurrency gets OOM-killed part way through and leaves a truncated mp4
 * that still looks like a success. Chunks of ~400 frames at concurrency 1
 * complete reliably and fail loudly.
 *
 * Video only (--muted). Audio is muxed separately in scripts/mux.sh so the
 * offset is explicit and measurable.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { AUDIO_DURATION, TIMINGS_ARE_MEASURED } from "../src/captions.ts";

const FPS = 30;
const CHUNK = 400;
const TAIL = 0.6;

if (!TIMINGS_ARE_MEASURED) {
  console.error("render: captions.ts still holds estimated timings. Run align first.");
  process.exit(1);
}

const totalFrames = Math.round((AUDIO_DURATION + TAIL) * FPS);
fs.rmSync("out/chunks", { recursive: true, force: true });
fs.mkdirSync("out/chunks", { recursive: true });

const parts = [];
for (let start = 0; start < totalFrames; start += CHUNK) {
  const end = Math.min(start + CHUNK - 1, totalFrames - 1);
  const file = `out/chunks/part-${String(parts.length).padStart(3, "0")}.mp4`;
  console.log(`render: frames ${start}-${end} -> ${file}`);
  execFileSync(
    "npx",
    ["remotion", "render", "src/index.ts", "IAVideo", file,
     "--frames", `${start}-${end}`, "--muted", "--concurrency", "1",
     "--log", "error"],
    { stdio: "inherit" }
  );
  if (!fs.existsSync(file) || fs.statSync(file).size < 1000) {
    console.error(`render: ${file} is missing or empty. Chunk failed.`);
    process.exit(1);
  }
  parts.push(file);
}

fs.writeFileSync(
  "out/chunks/list.txt",
  parts.map((p) => `file '${p.replace("out/chunks/", "")}'`).join("\n") + "\n"
);
execFileSync(
  "ffmpeg",
  ["-y", "-v", "error", "-f", "concat", "-safe", "0",
   "-i", "out/chunks/list.txt", "-c", "copy", "out/video.mp4"],
  { stdio: "inherit" }
);
console.log(`render: ${parts.length} chunks -> out/video.mp4 (${totalFrames} frames)`);
