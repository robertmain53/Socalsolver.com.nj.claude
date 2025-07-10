#!/bin/bash
echo "🔍 Scanning for client components using top-level async/await..."

files=$(grep -rl "'use client'" ./src --include="*.tsx")

commit_needed=false

for file in $files; do
  echo "🔧 Checking: $file"

  if grep -qE "^\s*(await |async function )" "$file"; then
    echo "⚠️  Found top-level async/await in: $file"
    cp "$file" "$file.bak"

    # Ensure useState/useEffect are imported
    if ! grep -q "useEffect" "$file"; then
      sed -i '/^import .*react/s/react/React, { useState, useEffect }/' "$file"
    elif ! grep -q "useState" "$file"; then
      sed -i '/^import .*react/s/{/{ useState,/' "$file"
    fi

    # Extract first awaited variable
    varName=$(grep -E "^\s*const\s+(\w+)\s*=\s*await" "$file" | sed -E 's/^\s*const\s+(\w+)\s*=.*/\1/' | head -n 1)
    [ -z "$varName" ] && varName="data"

    # Insert useState hook after imports
    sed -i "/^import /a const [$varName, set${varName^}] = useState(null);" "$file"

    # Wrap async in useEffect
    awk -v var="$varName" '
      BEGIN { inserted = 0 }
      {
        if (!inserted && /^\s*(await |const\s+'"$var"'\s*=\s*await)/) {
          print "\nuseEffect(() => {\n  (async () => {"
          inserted = 1;
        }

        if (inserted && /^\s*const\s+'"$var"'\s*=\s*await/) {
          print "    const result = await " substr($0, index($0,$4));
          print "    set" toupper(substr(var,1,1)) substr(var,2) "(result)";
        } else {
          print;
        }
      }
      END {
        if (inserted) {
          print "  })();\n}, []);"
        }
      }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"

    # Format with Prettier
    if command -v prettier &> /dev/null; then
      prettier --write "$file"
      echo "✨ Prettier formatted: $file"
    fi

    # Stage and flag for commit
    git add "$file"
    commit_needed=true
    echo "✅ Refactored and staged: $file (backup: $file.bak)"
  fi
done

# Commit if any changes were made
if [ "$commit_needed" = true ]; then
  git commit -m "♻️ Refactor: moved top-level async to useEffect in client components"
  echo "✅ All changes committed."
else
  echo "✅ No async/await issues found. No commit necessary."
fi

echo "🎉 All done!"
