#!/usr/bin/env bash
# Extracts study frames from the inspiration video.
# Output goes OUTSIDE the repo (default /tmp/ref) — frames are never committed or shipped (Rules.md §8.6).
#
# Usage: bash scripts/extract-reference-frames.sh [output_dir] [fps]
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)/_brief/assets/Video.mp4"
OUT="${1:-/tmp/ref}"
FPS="${2:-2}"

command -v ffmpeg >/dev/null || { echo "ffmpeg is required" >&2; exit 1; }
[ -f "$SRC" ] || { echo "Missing $SRC" >&2; exit 1; }

case "$OUT" in
  "$(cd "$(dirname "$0")/.." && pwd)"*) echo "Refusing to write frames inside the repository" >&2; exit 1 ;;
esac

mkdir -p "$OUT/frames" "$OUT/sheets" "$OUT/cuts"

# 1. Even sampling — rhythm and pacing.
ffmpeg -loglevel error -y -i "$SRC" -vf "fps=${FPS},scale=960:-1" "$OUT/frames/frame_%03d.jpg"

# 2. Contact sheets (4×2 per sheet, timestamped) — whole film at a glance.
ffmpeg -loglevel error -y -i "$SRC" \
  -vf "fps=${FPS},scale=320:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6,tile=4x2" \
  "$OUT/sheets/sheet_%02d.jpg"

# 3. Scene-change frames — where the cuts and transitions happen.
ffmpeg -loglevel error -y -i "$SRC" \
  -vf "select='gt(scene,0.25)',showinfo,scale=480:-1" -vsync vfr "$OUT/cuts/cut_%03d.jpg" 2> "$OUT/cuts/cuts.log" || true
grep -o 'pts_time:[0-9.]*' "$OUT/cuts/cuts.log" | cut -d: -f2 > "$OUT/cuts/times.txt" || true

echo "Frames: $(ls "$OUT/frames" | wc -l) · Sheets: $(ls "$OUT/sheets" | wc -l) · Cuts: $(wc -l < "$OUT/cuts/times.txt") → $OUT"
