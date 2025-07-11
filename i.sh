#!/bin/bash
echo "🔧 Fixing MDX invalid comments..."
find content -name "*.mdx" -print0 | while IFS= read -r -d '' file; do
  if grep -q '<!--' "$file"; then
    echo "Fixing: $file"
    sed -i 's/<!--/{\/\*/g; s/-->/*\/}/g' "$file"
  fi
done

echo ""
echo "🔍 Scanning for async/await in client components..."
grep -rl "'use client'" src | while read -r file; do
  if grep -qE "await |async " "$file"; then
    echo "⚠️  Found async/await in client file: $file"
    echo "   ➤ You must move the async logic to a separate server utility or route."
  fi
done

echo ""
echo "✅ Done. Please re-run: npm run dev"