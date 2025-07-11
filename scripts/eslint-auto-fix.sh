#!/usr/bin/env bash
#
# scripts/eslint-auto-fix.sh
# -------------------------------------------------------------
# Run ESLint in “fix” mode on the ACTIVE codebase, skipping any
# feature-flagged or disabled modules.  Produces a before/after
# error count so you can commit in clean logical chunks.
# -------------------------------------------------------------

set -euo pipefail
ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

echo "🔧  ESLint Auto-Fix Utility"
echo "📂  Project root: $ROOT_DIR"
echo "-------------------------------------------------------------"

# 1. Identify target directories (exclude *.disabled and generated stuff)
TARGETS=$(git ls-files "$ROOT_DIR/src" \
  | grep -Ev '\.disabled/|\.generated/' \
  | grep -E '\.(ts|tsx)$' \
  | xargs dirname \
  | sort -u)

# 2. Pre-scan – how many problems right now?
echo "🔍  Counting current ESLint problems..."
PRE_ERRORS=$(npx eslint $TARGETS -f unix || true | wc -l)
echo "   →  $PRE_ERRORS total ESLint messages before --fix"

# 3. Run eslint --fix
echo "🛠️   Running eslint --fix (this might take a minute)..."
npx eslint $TARGETS --fix

# 4. Post-scan – what’s left?
echo "🔍  Re-scanning after auto-fix..."
POST_ERRORS=$(npx eslint $TARGETS -f unix || true | wc -l)
echo "   →  $POST_ERRORS ESLint messages remain after --fix"

# 5. Commit suggestion
FIXED=$(( PRE_ERRORS - POST_ERRORS ))
echo "-------------------------------------------------------------"
echo "✅  Auto-fixed: $FIXED issues"
echo "❗  Remaining : $POST_ERRORS issues  (most need manual work)"
echo
echo "💡  Next steps:"
echo "   • Review git diff → commit logical changes."
echo "   • Address remaining warnings/errors manually."
echo "-------------------------------------------------------------"
