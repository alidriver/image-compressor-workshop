#!/usr/bin/env bash
# Build a distributable zip of this project, placed one directory up.
# Excludes node_modules, build output, and macOS junk.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="$(basename "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
OUT="$PARENT_DIR/image-compressor-project.zip"

cd "$PARENT_DIR"
rm -f "$OUT"
zip -r "$OUT" "$PROJECT_NAME" \
  -x "$PROJECT_NAME/node_modules/*" \
     "$PROJECT_NAME/dist/*" \
     "$PROJECT_NAME/.DS_Store" \
     "$PROJECT_NAME/**/.DS_Store" \
     "$PROJECT_NAME/.git/*" \
     "$PROJECT_NAME/.devcontainer/*" \
     "$PROJECT_NAME/*.zip" \
     "$PROJECT_NAME/TODO.md" \
     "$PROJECT_NAME/make-zip.sh"

echo
echo "Wrote $OUT ($(du -h "$OUT" | cut -f1))"
