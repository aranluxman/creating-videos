/**
 * Generate the voiceover as ONE continuous take and write public/voiceover.mp3.
 *
 * Per-line generation loses prosody and creates audible cuts, so the whole
 * script goes in one request. Blank lines between paragraphs are what create
 * the pauses the aligner later keys off, so they are preserved exactly.
 *
 * Run: node --experimental-strip-types scripts/tts.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { LINES, VOICE, WORD_COUNT } from "../src/script.ts";

const OUT = path.resolve("public/voiceover.mp3");

const readEnv = () => {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  if (!fs.existsSync(".env")) return null;
  const m = fs.readFileSync(".env", "utf8").match(/^ELEVENLABS_API_KEY=(.+)$/m);
  return m ? m[1].trim() : null;
};

const key = readEnv();
if (!key) {
  console.error("tts: no ELEVENLABS_API_KEY. Copy .env.example to .env.");
  process.exit(1);
}

if (fs.existsSync(OUT) && process.env.FORCE_TTS !== "1") {
  console.log(`tts: ${OUT} already exists, reusing. FORCE_TTS=1 to regenerate.`);
  process.exit(0);
}

const text = LINES.join("\n\n");
console.log(`tts: ${WORD_COUNT} words, ${LINES.length} lines, voice ${VOICE.voice_id}`);

const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${VOICE.voice_id}?output_format=${VOICE.output_format}`,
  {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: VOICE.model_id,
      voice_settings: { stability: 0.45, similarity_boost: 0.75, style: 0.0 },
    }),
  }
);

if (res.status === 401) {
  console.error("tts: 401 from ElevenLabs. The API key was rotated or is wrong.");
  process.exit(1);
}
if (!res.ok) {
  console.error(`tts: ElevenLabs returned ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const buf = Buffer.from(await res.arrayBuffer());
if (buf.length < 20_000) {
  console.error(`tts: response was only ${buf.length} bytes. That is not a voiceover.`);
  process.exit(1);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`tts: wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB)`);
