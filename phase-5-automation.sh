#!/bin/bash

echo "🚀 Phase 5: Automation & Scale"

# Create GitHub Action to test SEO diffs and structured data
mkdir -p .github/workflows
cat << 'EOF' > .github/workflows/seo-ci.yml
name: SEO & Structured Data CI

on:
  pull_request:
    paths:
      - 'content/calculators/**.mdx'

jobs:
  seo-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install deps
        run: npm ci

      - name: Run SEO Validator
        run: npm run validate:seo

      - name: Check Structured Data
        run: npm run validate:schema
EOF

# Add placeholder validation scripts
mkdir -p scripts
cat << 'EOF' > scripts/validate-seo.ts
import fs from 'fs';
import path from 'path';

const folder = 'content/calculators';
const files = fs.readdirSync(folder);

for (const file of files) {
  const content = fs.readFileSync(path.join(folder, file), 'utf-8');
  if (!content.includes('title:')) console.warn(`⚠️  Missing title in ${file}`);
  if (!content.includes('description:')) console.warn(`⚠️  Missing description in ${file}`);
  if (!content.includes('author:')) console.warn(`⚠️  Missing author in ${file}`);
}

console.log('✅ SEO validation complete');
EOF

cat << 'EOF' > scripts/validate-schema.ts
import fs from 'fs';
import path from 'path';

const requiredFields = ['reviewed_by', 'audience', 'difficulty'];
const files = fs.readdirSync('content/calculators');

for (const file of files) {
  const text = fs.readFileSync(path.join('content/calculators', file), 'utf-8');
  for (const field of requiredFields) {
    if (!text.includes(`${field}:`)) {
      console.warn(`⚠️  Missing ${field} in ${file}`);
    }
  }
}

console.log('✅ Structured schema check done');
EOF

# Register new scripts in package.json
npx json -I -f package.json -e '
  this.scripts["validate:seo"] = "tsx scripts/validate-seo.ts"
  this.scripts["validate:schema"] = "tsx scripts/validate-schema.ts"
'

# Completion message
echo "✅ Phase 5 complete. You now have SEO & schema validation on PRs!"
