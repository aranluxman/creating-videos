#!/usr/bin/env bash
# Fails loudly if the voiceover is missing, silent, or absurdly short.
# A max_volume near -91 dB means a silent placeholder, not narration.
set -euo pipefail
AUDIO="${1:-public/voiceover.mp3}"
[ -f "$AUDIO" ] || { echo "verify_audio: $AUDIO does not exist"; exit 1; }

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$AUDIO")
VOL=$(ffmpeg -v error -i "$AUDIO" -af volumedetect -f null /dev/null 2>&1 || true)
MAXV=$(ffmpeg -i "$AUDIO" -af volumedetect -f null /dev/null 2>&1 | grep max_volume | awk '{print $5}')
MEANV=$(ffmpeg -i "$AUDIO" -af volumedetect -f null /dev/null 2>&1 | grep mean_volume | awk '{print $5}')

echo "verify_audio: duration=${DUR}s max_volume=${MAXV}dB mean_volume=${MEANV}dB"

python3 - "$DUR" "$MAXV" <<'PY'
import sys
dur, maxv = float(sys.argv[1]), float(sys.argv[2])
if dur < 20:
    sys.exit(f"verify_audio: {dur:.1f}s is too short to be the full script")
if maxv < -60:
    sys.exit(f"verify_audio: max_volume {maxv} dB means silence, not narration")
print("verify_audio: OK")
PY
