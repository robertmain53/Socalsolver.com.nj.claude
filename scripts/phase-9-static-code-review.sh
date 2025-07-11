#!/bin/bash

echo "🧪 Phase 9: Static Code Review - File-by-File Analysis"

SRC_DIR="./src"
REPORT_DIR="./scripts/reports"
REPORT_FILE="$REPORT_DIR/phase-9-static-analysis.md"
ERROR_TMP="./scripts/reports/_errors.tmp"

mkdir -p "$REPORT_DIR"
echo "# Static Code Analysis Report (Phase 9)" > "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| File | ESLint Errors | TypeScript Errors |" >> "$REPORT_FILE"
echo "|------|----------------|-------------------|" >> "$REPORT_FILE"

# Analyze each file
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
  eslint_errors=$(npx eslint "$file" -f compact 2>/dev/null | wc -l)
  tsc_errors=$(npx tsc --noEmit "$file" 2>&1 | grep "$file" | wc -l)

  echo "| $file | $eslint_errors | $tsc_errors |" >> "$REPORT_FILE"
done

echo ""
echo "✅ Phase 9 report generated: $REPORT_FILE"
