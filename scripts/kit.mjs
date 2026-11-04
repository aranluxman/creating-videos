/**
 * Stills of every mock in the visual kit (src/Kit.tsx), at an early frame
 * and after its animation settles, plus a contact sheet at out/kit-sheet.png.
 * Run after any change to src/components/Mocks.tsx and LOOK at the sheet.
 *
 *   node --experimental-strip-types --no-warnings scripts/kit.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
// Kit.tsx holds JSX, which node cannot import directly, so read the names.
const src = fs.readFileSync("src/Kit.tsx", "utf8");
const KIT = [...src.matchAll(/^  \{ name: "([^"]+)"/gm)].map((m) => ({ name: m[1] }));
const KIT_SECONDS = Number(src.match(/KIT_SECONDS = (\d+)/)[1]);

const FPS = 30;
fs.rmSync("out/kit", { recursive: true, force: true });
fs.mkdirSync("out/kit", { recursive: true });
KIT.forEach((k, i) => {
  const base = i * KIT_SECONDS * FPS;
  const frame = base + 80;
  const file = `out/kit/${String(i + 1).padStart(2, "0")}-${k.name}.png`;
  execFileSync("npx", ["remotion", "still", "src/index.ts", "KitPreview", file,
    "--frame", String(frame), "--log", "error"], { stdio: "inherit" });
  console.log(`kit: ${k.name} @ ${frame}`);
});
const cols = 5;
const rows = Math.ceil(KIT.length / cols);
execFileSync("ffmpeg", ["-y", "-v", "error", "-pattern_type", "glob", "-i", "out/kit/*.png",
  "-filter_complex", `scale=300:-1,tile=${cols}x${rows}:padding=8:color=0x333333`,
  "-frames:v", "1", "out/kit-sheet.png"], { stdio: "inherit" });
console.log("kit: sheet -> out/kit-sheet.png");
