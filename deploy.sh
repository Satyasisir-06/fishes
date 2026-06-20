#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────
#  deploy.sh — Build + Commit + Push to Vercel
#  Usage:
#    ./deploy.sh "Your commit message"
#    ./deploy.sh                      # prompts for message
# ──────────────────────────────────────────────

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

echo "═══════════════════════════════════════════"
echo "  🚀  Kicchu Deploy Script"
echo "═══════════════════════════════════════════"

# ── 1. Build ──────────────────────────────────
echo ""
echo "▸ Step 1/4: Building Next.js…"
echo ""
if npm run build; then
  echo "  ✅  Build passed"
else
  echo "  ❌  Build failed — aborting"
  exit 1
fi

# ── 2. Stage ──────────────────────────────────
echo ""
echo "▸ Step 2/4: Staging changes…"
git add -A
if git diff --cached --quiet; then
  echo "  ℹ️   Nothing to commit — aborting"
  exit 0
fi
echo "  ✅  Files staged"

# ── 3. Commit ─────────────────────────────────
echo ""
echo "▸ Step 3/4: Committing…"

COMMIT_MSG="${1:-}"
if [ -z "$COMMIT_MSG" ]; then
  # Use default message with date if none provided
  COMMIT_MSG="deploy: $(date '+%Y-%m-%d %H:%M')"
fi

git commit -m "$COMMIT_MSG"
echo "  ✅  Committed: $COMMIT_MSG"

# ── 4. Push ───────────────────────────────────
echo ""
echo "▸ Step 4/4: Pushing to remote…"
git pull --rebase 2>/dev/null || true
git push
echo ""
echo "═══════════════════════════════════════════"
echo "  ✅  Deployed — Vercel is building now!"
echo "═══════════════════════════════════════════"
