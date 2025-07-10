#!/bin/bash

echo "🔧 Refactoring dynamic routes to avoid conflicts..."

# Paths
CALC_ROUTE="src/app/calculators/[slug]"
CAT_ROUTE="src/app/calculators/category"
NEW_CALC_ROUTE="src/app/calculator/[slug]"
NEW_CAT_ROUTE="src/app/categories"

# Move calculator slug route
if [ -d "$CALC_ROUTE" ]; then
  mkdir -p "$(dirname "$NEW_CALC_ROUTE")"
  mv "$CALC_ROUTE" "$NEW_CALC_ROUTE"
  echo "✅ Moved [slug] → $NEW_CALC_ROUTE"
else
  echo "ℹ️  [slug] route not found — skipping."
fi

# Move category route
if [ -d "$CAT_ROUTE" ]; then
  mkdir -p "$NEW_CAT_ROUTE"
  mv "$CAT_ROUTE" "$NEW_CAT_ROUTE"
  echo "✅ Moved category → $NEW_CAT_ROUTE"
else
  echo "ℹ️  category route not found — skipping."
fi

# Update imports and links across project
echo "🔍 Updating route references in codebase..."

find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|/calculators/\[slug\]|/calculator/[slug]|g' {} +
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|/calculators/category|/categories|g' {} +

echo "✅ Updated route references."

# Confirm
echo "✅ All route conflicts resolved. You can now run: npm run dev"
