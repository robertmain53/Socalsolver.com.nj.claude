#!/bin/bash
echo "🔍 Scanning for client components using top-level async/await..."

# Find all .tsx files in /src marked with 'use client'
files=$(grep -rl "'use client'" ./src --include="*.tsx")

for file in $files; do
  echo "🔧 Checking: $file"

  if grep -qE "^\s*async function|^\s*await " "$file"; then
    echo "⚠️  Potential top-level async/await misuse found in: $file"
    
    # Create backup
    cp "$file" "$file.bak"

    # Insert comment note at top if not already present
    if ! grep -q "// TODO: Move async/await into useEffect" "$file"; then
      sed -i '2i\// TODO: Move async/await into useEffect — Next.js does not support top-level async in client components' "$file"
    fi
  fi
done

echo "✅ Done. Backups saved with .bak suffix. Review and fix manually or refactor logic into useEffect."

