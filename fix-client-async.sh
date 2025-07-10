#!/bin/bash
echo "🔍 Scanning for Client Components using async default exports..."

# Find all .tsx files that include "use client"
FILES=$(grep -rl "'use client'" ./src --include \*.tsx)

for FILE in $FILES; do
  if grep -q "export default async function" "$FILE"; then
    echo "⚠️  Fixing async in: $FILE"
    cp "$FILE" "$FILE.bak" # backup

    # Replace "export default async function" with "export default function"
    sed -i "s/export default async function/export default function/" "$FILE"
  fi
done

echo "✅ Done. All async default exports in Client Components have been fixed."
echo "💡 Backups saved with .bak extension."
