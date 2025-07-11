#!/bin/bash

echo "🧩 Phase 6B: Scaffolding category metadata in JSON..."

CATEGORIES=("finance" "mathematics" "health" "science" "everyday" "business" "education" "environment" "construction" "fun")
DEST_DIR="src/content/categories"

mkdir -p "$DEST_DIR"

for CAT in "${CATEGORIES[@]}"; do
  FILE="$DEST_DIR/$CAT.json"
  TITLE="$(tr '[:lower:]' '[:upper:]' <<< ${CAT:0:1})${CAT:1}"
  DESC="This category covers calculators related to $TITLE."
  FAQ='[{"q": "What is this category about?", "a": "It includes tools for '"$TITLE"'."}]'

  echo "📝 Generating $FILE"

  jq -n \
    --arg title "$TITLE" \
    --arg desc "$DESC" \
    --argjson faq "$FAQ" \
    '{
      title: $title,
      description: $desc,
      faq: $faq,
      seo: {
        metaTitle: "\($title) Calculators",
        metaDescription: $desc
      },
      schema: {}
    }' > "$FILE"

done

echo "✅ Metadata JSON scaffold created under $DEST_DIR/"
