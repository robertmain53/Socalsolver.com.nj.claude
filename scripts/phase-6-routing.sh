#!/bin/bash

echo "🌐 Phase 6: Generating Category Routing, Metadata, and EEAT Pages..."

# Base directories
ROUTES_DIR="src/app"
EEAT_DIR="$ROUTES_DIR/info"
CATEGORIES_DIR="$ROUTES_DIR/calculators"

mkdir -p "$EEAT_DIR" "$CATEGORIES_DIR"

# Create EEAT pages (Terms, Privacy, About, Cookies)
PAGES=("about" "terms" "privacy" "cookies")

for PAGE in "${PAGES[@]}"; do
  FILE="$EEAT_DIR/$PAGE/page.tsx"
  mkdir -p "$(dirname "$FILE")"
  cat > "$FILE" <<EOF
export default function ${PAGE^}Page() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">${PAGE^}</h1>
      <p>Content for ${PAGE} goes here. Edit this in <code>src/app/info/${PAGE}/page.tsx</code>.</p>
    </div>
  );
}
EOF
done

echo "✅ EEAT pages scaffolded at /info/*"

# Define top-level categories
CATEGORIES=("finance" "mathematics" "health" "science" "everyday" "business" "education" "environment" "construction" "fun")

for CAT in "${CATEGORIES[@]}"; do
  mkdir -p "$CATEGORIES_DIR/$CAT"
  FILE="$CATEGORIES_DIR/$CAT/page.tsx"
  cat > "$FILE" <<EOF
export default function ${CAT^}CategoryPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">${CAT^} Calculators</h1>
      <p>This page will list all subcategories and calculators in the ${CAT^} domain.</p>
    </div>
  );
}
EOF
done

echo "✅ Category routes scaffolded under /calculators/[category]"

# Create homepage
mkdir -p "$ROUTES_DIR/(main)"
cat > "$ROUTES_DIR/(main)/page.tsx" <<EOF
export default function HomePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Calculator Platform</h1>
      <p>This is the homepage. Categories and featured calculators will appear here.</p>
    </div>
  );
}
EOF

echo "✅ Homepage created at /"
