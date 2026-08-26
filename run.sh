#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")"

STEP=""
step () { STEP="$1"; echo ""; echo "=== $1"; }
fail () { echo ""; echo "PIPELINE FAILED at step: ${STEP}"; echo "reason: $1"; exit 1; }
run  () { "$@" || fail "command failed: $*"; }

NODE="node --experimental-strip-types --no-warnings"

step "1/8 preflight"
command -v ffmpeg  >/dev/null || fail "ffmpeg is not installed"
command -v ffprobe >/dev/null || fail "ffprobe is not installed"
command -v python3 >/dev/null || fail "python3 is not installed"
[ -d node_modules ] || fail "node_modules missing. Run: npm install"
[ -f .env ] || fail ".env missing. Copy .env.example to .env and add the ElevenLabs key."
grep -q "^ELEVENLABS_API_KEY=sk_" .env || fail ".env has no usable ELEVENLABS_API_KEY"
echo "preflight OK"

step "2/8 typecheck"
run npx tsc --noEmit

step "3/8 voiceover (ElevenLabs, one continuous take)"
run $NODE scripts/tts.mjs

step "4/8 verify the voiceover is real audio"
run bash scripts/verify_audio.sh public/voiceover.mp3

step "5/8 align captions to the measured audio"
run python3 scripts/align.py public/voiceover.mp3

step "6/8 render (chunked, video only)"
run $NODE scripts/render.mjs

step "7/8 mux narration, then prove it is in the file"
run bash scripts/mux.sh
run bash scripts/verify_mux.sh out/FINAL.mp4
run bash scripts/verify_mux.sh out/upload.mp4

step "8/8 stills, contact sheet, and per-platform captions"
run $NODE scripts/stills.mjs
run $NODE scripts/captions.mjs

echo ""
echo "=== DONE"
ls -lh out/FINAL.mp4 out/upload.mp4 out/captions.md out/contact-sheet.png
