#!/bin/bash

echo "🔍 Checking for conflicting dynamic route folders..."

CONFLICTING_ROUTES=$(find src/app/calculators -type d -name "[[]*[]]" ! -name "[slug]")

if [ -n "$CONFLICTING_ROUTES" ]; then
  echo "❌ Found conflicting dynamic route folders:"
  echo "$CONFLICTING_ROUTES"
  echo "Please remove or relocate them to avoid slug conflicts."
else
  echo "✅ No conflicting dynamic route folders detected."
fi

echo "🔍 Checking next.config.js for deprecated or invalid fields..."

if grep -q "experimental.*appDir" next.config.js; then
  echo "❌ 'experimental.appDir' is deprecated. Remove it."
else
  echo "✅ 'experimental.appDir' not found — good."
fi

if grep -q "localeDetection:.*[^false|true]" next.config.js; then
  echo "⚠️  Check if 'localeDetection' is a valid boolean value (true/false)."
else
  echo "✅ 'localeDetection' appears correct."
fi

echo "🧪 Running basic Next.js build test..."

npm run build > /dev/null

if [ $? -eq 0 ]; then
  echo "✅ Next.js build succeeded."
else
  echo "❌ Next.js build failed — check logs."
fi

echo "✅ Validation complete."

