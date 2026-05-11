#!/usr/bin/env bash
# Pre-flight check before running `npm start`.
# Verifies Node, npm, and free disk space, with friendly fix-it messages.

MIN_NODE_MAJOR=20
MIN_DISK_MB=500

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
DIM='\033[2m'
NC='\033[0m'

ok()    { printf "  ${GREEN}✓${NC} %s\n" "$1"; }
fail()  { printf "  ${RED}✗${NC} %s\n" "$1"; }
warn()  { printf "  ${YELLOW}!${NC} %s\n" "$1"; }
hint()  { printf "    ${DIM}%s${NC}\n" "$1"; }

ERRORS=0
fail_with() { fail "$1"; ERRORS=$((ERRORS+1)); }

echo
echo "Pre-flight check"
echo "────────────────"

# ─── Node ─────────────────────────────────────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  fail_with "Node.js is not installed"
  hint "Download the LTS installer: https://nodejs.org"
  hint "After installing, close and reopen Terminal."
else
  NODE_VERSION=$(node --version)
  NODE_MAJOR=$(echo "$NODE_VERSION" | sed -E 's/^v([0-9]+).*/\1/')
  if [ "$NODE_MAJOR" -lt "$MIN_NODE_MAJOR" ]; then
    fail_with "Node $NODE_VERSION (need v${MIN_NODE_MAJOR} or newer)"
    hint "Update from https://nodejs.org — install the latest LTS."
  else
    ok "Node $NODE_VERSION"
  fi
fi

# ─── npm ──────────────────────────────────────────────────────────────────
if ! command -v npm >/dev/null 2>&1; then
  fail_with "npm is not installed"
  hint "It comes bundled with Node — try reinstalling Node from https://nodejs.org"
else
  NPM_VERSION=$(npm --version)
  ok "npm $NPM_VERSION"
fi

# ─── Disk ─────────────────────────────────────────────────────────────────
DISK_AVAIL_MB=$(df -m . | awk 'NR==2 {print $4}')
if [ "$DISK_AVAIL_MB" -lt "$MIN_DISK_MB" ]; then
  warn "Only ${DISK_AVAIL_MB} MB free here (recommend ${MIN_DISK_MB}+)"
else
  ok "${DISK_AVAIL_MB} MB free disk"
fi

# ─── Result ───────────────────────────────────────────────────────────────
echo
if [ "$ERRORS" -gt 0 ]; then
  printf "${RED}Not ready yet.${NC} Fix the items above, then run this script again.\n"
  exit 1
fi

printf "${GREEN}You're good — run:${NC} npm start\n"
echo
