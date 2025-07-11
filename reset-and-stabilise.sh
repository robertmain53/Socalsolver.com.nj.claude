#!/usr/bin/env bash
set -e
echo "🚀  Resetting & stabilising Calculator Platform …"

################################################################################
## 0. CORE DIRS
################################################################################
mkdir -p content/calculators content/status src/components/calculators scripts

################################################################################
## 1. TYPE & DEV TOOLS
################################################################################
npm install --save gray-matter slugify
npm install --save-dev typescript tsx husky esbuild @types/node

# tsconfig (only if absent)
[ -f tsconfig.json ] || cat <<'JSON' > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "jsx": "preserve"
  },
  "include": ["src", "scripts"]
}
JSON

################################################################################
## 2. HUSKY PRE-COMMIT GUARD
################################################################################
npx husky install
cat <<'HOOK' > .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Guard: async/await inside 'use client'..."
violations=$(grep -rl "'use client'" src | xargs grep -lE "await|async" || true)
if [ -n "$violations" ]; then
  echo "❌ Blocked commit. Async in client component(s):"
  echo "$violations"
  exit 1
fi
echo "✅ Guard passed"
HOOK
chmod +x .husky/pre-commit

################################################################################
## 3. CALCULATOR REGISTRY (auto-glob)
################################################################################
mkdir -p src/lib
cat <<'TS' > src/lib/calculator-registry.ts
export const calculators = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../generated/calculators/*.js', { eager: true })
  ).map(([p, mod]: any) => [p.split('/').pop()!.replace('.js', ''), mod])
);
TS

################################################################################
## 4. NEW CALCULATOR SCAFFOLDER
################################################################################
cat <<'TS' > scripts/new-calculator.ts
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import matter from 'gray-matter';

// argv[2] = slug or free-text title
const input = process.argv.slice(2).join(' ');
if (!input) {
  console.error('Usage: npm run new:calculator "<slug-or-title>"');
  process.exit(1);
}

const slug = slugify(input, { lower: true });
const title = input
  .split('-')
  .map((w) => w[0].toUpperCase() + w.slice(1))
  .join(' ');
const componentName = title.replace(/\s+/g, '');

const mdxPath = `content/calculators/${slug}.mdx`;
const compDir = 'src/components/calculators';
const compPath = `${compDir}/${componentName}.tsx`;
const statusPath = `content/status/${slug}.json`;
const testPath = `__tests__/${slug}.test.tsx`;

if (fs.existsSync(mdxPath)) {
  console.error('❌ Calculator already exists:', slug);
  process.exit(1);
}

// --- write MDX
fs.mkdirSync(path.dirname(mdxPath), { recursive: true });
fs.writeFileSync(
  mdxPath,
  `---
title: ${title}
category: general
tags: []
difficulty: easy
audience: learners
---

<${componentName} />

## 🧾 How It Works

Explain…

## 🧠 Learn

Context…

## 🎓 Try a Challenge

:::challenge
{ "question": "What is 1 + 1?", "answer": "2" }
:::
`
);

// --- write Component
fs.mkdirSync(compDir, { recursive: true });
fs.writeFileSync(
  compPath,
  `'use client';

export default function ${componentName}() {
  return <div>${componentName} Calculator works!</div>;
}
`
);

// --- write status stub
fs.mkdirSync(path.dirname(statusPath), { recursive: true });
fs.writeFileSync(
  statusPath,
  JSON.stringify(
    {
      slug,
      status: 'draft',
      editorNotes: '',
      lastUpdated: new Date().toISOString()
    },
    null,
    2
  )
);

// --- write simple test placeholder
fs.mkdirSync('__tests__', { recursive: true });
fs.writeFileSync(
  testPath,
  `describe('${componentName}', () => {
  it('renders', () => {
    expect(true).toBe(true);
  });
});
`
);

console.log('✅  New calculator scaffolded:');
console.log('📄', mdxPath);
console.log('🧩', compPath);
console.log('🗂 ', statusPath);
TS

################################################################################
## 5. ADD NPM SCRIPTS
################################################################################
npx json -I -f package.json -e '
this.scripts ||= {};
this.scripts["new:calculator"]="tsx scripts/new-calculator.ts";
'

################################################################################
echo "🎉  Setup complete. Try: npm run new:calculator \"compound-interest\""
