#!/bin/bash

echo "🧹 Resetting broken state..."

# 1. Ensure all dependencies are installed
echo "📦 Installing correct dependencies..."
npm install next-mdx-remote@4 gray-matter react-markdown fs-extra

# 2. Recreate missing directories and core MDX components
echo "📁 Scaffolding components and MDX logic..."
mkdir -p src/components/mdx

# 3. Create Challenge.tsx MDX component
cat << 'EOF' > src/components/mdx/Challenge.tsx
type Props = {
  question: string;
  answer: string;
};
export default function Challenge({ question, answer }: Props) {
  return (
    <div className="p-4 border rounded bg-yellow-50 my-4">
      <strong>🤔 Challenge:</strong>
      <p className="mt-2">{question}</p>
      <details className="mt-2">
        <summary className="cursor-pointer">Answer</summary>
        <p>{answer}</p>
      </details>
    </div>
  );
}
EOF

# 4. Patch MDX loader (optional if using next-mdx-remote correctly)
echo "🔧 Fixing next.config.js..."
cat << 'EOF' > next.config.js
/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});
module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
});
EOF

# 5. Patch broken .mdx syntax (example)
echo "✍️ Fixing example content file..."
cat << 'EOF' > content/calculators/test-calculator.mdx
---
title: Test Calculator
category: test
tags: [example]
difficulty: easy
audience: learners
---

import Challenge from '@/components/mdx/Challenge'

<Challenge question="What is 1 + 1?" answer="2" />
EOF

# 6. Patch broken fetch in server page
echo "🧠 Patching edit/[slug]/page.tsx..."
cat << 'EOF' > src/app/dashboard/edit/[slug]/page.tsx
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import EditorClient from '@/components/dashboard/EditorClient';

export default async function EditPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content/calculators', \`\${slug}.mdx\`);

  try {
    const file = await fs.readFile(filePath, 'utf-8');
    const { content, data } = matter(file);

    return (
      <EditorClient
        slug={slug}
        initialContent={content}
        initialStatus={{ title: data.title || slug }}
      />
    );
  } catch (err) {
    console.error('❌ Failed to load MDX file:', err);
    return <div className="text-red-600">Error loading calculator.</div>;
  }
}
EOF

# 7. Clean cache
echo "🧼 Cleaning Next.js cache..."
rm -rf .next

echo "✅ Done. You can now run: npm run dev"
