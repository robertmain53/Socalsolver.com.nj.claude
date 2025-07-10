#!/bin/bash
echo "🔍 Scanning for client components using top-level async/await..."

# Find all .tsx files with 'use client' at the top
files=$(grep -rl "'use client'" ./src --include="*.tsx")

for file in $files; do
  echo "🔧 Checking: $file"

  if grep -qE "^\s*async function|^\s*await " "$file"; then
    echo "⚠️  Found top-level async in: $file"
    cp "$file" "$file.bak"

    # Check if useEffect is already imported
    if ! grep -q "useEffect" "$file"; then
      sed -i '/^import / s/react/React, { useEffect }/' "$file"
    fi

    # Look for top-level await or async call (basic heuristic)
    # We'll wrap it inside a useEffect block if it's not already inside one
    awk '
      BEGIN { inserted = 0 }
      /use client/ { print; next }
      {
        if (!inserted && /^\s*(const|let|var|await|async)/) {
          print "\nuseEffect(() => {\n  (async () => {";
          inserted = 1;
        }
        print;
      }
      END {
        if (inserted) {
          print "  })();\n}, []);"
        }
      }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"

    echo "✅ Auto-wrapped async logic in useEffect. Backup: $file.bak"
  fi
done

echo "🎉 Done! You may still want to test these changes manually."

