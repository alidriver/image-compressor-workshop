#!/usr/bin/env bash
# Build a "ready-to-run" zip — includes node_modules so the recipient can
# start the dev server without running `npm install` first.
# Output is placed one directory up.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="$(basename "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
OUT="$PARENT_DIR/image-compressor-project-ready.zip"

if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  echo "node_modules not found — running 'npm install' first..."
  (cd "$SCRIPT_DIR" && npm install)
fi

cd "$PARENT_DIR"
rm -f "$OUT"
zip -r "$OUT" "$PROJECT_NAME" \
  -x "$PROJECT_NAME/dist/*" \
     "$PROJECT_NAME/.DS_Store" \
     "$PROJECT_NAME/**/.DS_Store" \
     "$PROJECT_NAME/.git/*" \
     "$PROJECT_NAME/*.zip" \
     "$PROJECT_NAME/TODO.md" \
     "$PROJECT_NAME/make-zip.sh" \
     "$PROJECT_NAME/make-zip-ready.sh"

echo
echo "Wrote $OUT ($(du -h "$OUT" | cut -f1))"
