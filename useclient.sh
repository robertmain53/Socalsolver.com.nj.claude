#!/bin/bash

echo "🔍 Scanning for invalid async/await usage in Client Components..."

FILES=$(grep -rl "'use client'" src | xargs grep -El "async|await")

if [ -z "$FILES" ]; then
  echo "✅ No async/await in Client Components — you're clean!"
else
  echo "⚠️ The following files have invalid async/await usage inside Client Components:"
  echo "$FILES"
  echo ""
  echo "💡 Move the async logic to a server component (e.g., page.tsx) and pass props to a separate 'EditorClient.tsx'."
fi
