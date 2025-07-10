#!/bin/bash

echo "🔍 Removing Tailwind CSS from the project..."

# 1. Remove Tailwind packages from package.json
echo "📦 Removing Tailwind packages..."
npm uninstall tailwindcss postcss autoprefixer tailwindcss-animate @tailwindcss/forms @tailwindcss/typography

# 2. Delete Tailwind config files
echo "🧹 Deleting Tailwind config files..."
rm -f tailwind.config.js tailwind.config.ts postcss.config.js

# 3. Remove Tailwind directives from any CSS files
echo "✂️ Removing @tailwind directives from .css/.scss files..."
find . -type f \( -name "*.css" -o -name "*.scss" \) -exec sed -i '/@tailwind /d' {} \;

# 4. Remove Tailwind-specific class names (best-effort, leaves standard classes)
echo "🔍 Removing Tailwind utility classes from HTML/JSX/TSX..."
find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) -exec sed -i 's/\b\w*-?\(bg\|text\|border\|p\|m\|gap\|rounded\|font\|shadow\|grid\|flex\|items\|justify\|hover:\w*\|focus:\w*\)\w*\b//g' {} \;

# 5. Clean up double/trailing spaces left behind
find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.css" -o -name "*.scss" \) -exec sed -i 's/  \+/ /g' {} \;
find . -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.css" -o -name "*.scss" \) -exec sed -i 's/className="\s*"/className=""/g' {} \;

# 6. Optional: delete unused Tailwind stylesheets
echo "🗑️ Optionally deleting Tailwind-related global CSS..."
rm -f ./src/app/globals.css ./src/styles/tailwind.css

echo "✅ Tailwind CSS removed. You can now use plain CSS or CSS modules."
