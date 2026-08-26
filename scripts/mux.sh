#!/usr/bin/env bash
# Mux narration onto the silent render.
#
# adelay, never itsoffset. -itsoffset on the audio input shifts the stream
# timestamps but leaves the first packet at 0, which produced a video whose
# narration drifted later and later against the captions. adelay pads the
# samples themselves, so the offset is real and measurable.
set -euo pipefail
VIDEO=out/video.mp4
AUDIO=public/voiceover.mp3
DELAY_MS="${DELAY_MS:-0}"

[ -f "$VIDEO" ] || { echo "mux: $VIDEO missing"; exit 1; }
[ -f "$AUDIO" ] || { echo "mux: $AUDIO missing"; exit 1; }

# CRF 17 master. Archive quality, far too large to email.
ffmpeg -y -v error -i "$VIDEO" -i "$AUDIO" \
  -filter_complex "[1:a]adelay=${DELAY_MS}|${DELAY_MS},aresample=48000[a]" \
  -map 0:v -map "[a]" \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest out/FINAL.mp4

# Upload copy. Must stay under Gmail's 25 MB attachment limit.
ffmpeg -y -v error -i out/FINAL.mp4 \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
  -movflags +faststart -c:a aac -b:a 128k out/upload.mp4

echo "mux: FINAL.mp4 $(du -h out/FINAL.mp4 | cut -f1), upload.mp4 $(du -h out/upload.mp4 | cut -f1)"
