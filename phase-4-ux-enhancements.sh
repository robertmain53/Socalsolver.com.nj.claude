#!/bin/bash

echo "🧩 Phase 4: Embeds & UX Enhancements"

echo "📁 Creating embed-ready route..."
mkdir -p src/app/embed/[slug]
cat << 'EOF' > src/app/embed/[slug]/page.tsx
import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import MDXComponents from '@/components/MDXComponents';

export default async function EmbedPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content/calculators', `${slug}.mdx`);

  try {
    const file = await fs.readFile(filePath, 'utf-8');
    const { content } = await compileMDX({ source: file, components: MDXComponents });
    return (
      <html lang="en">
        <body style={{ margin: 0 }}>
          <div className="p-4 max-w-xl mx-auto">
            {content}
          </div>
        </body>
      </html>
    );
  } catch {
    notFound();
  }
}
EOF

echo "🧩 Adding <Explanation> and <Quiz> MDX components..."
mkdir -p src/components/mdx
cat << 'EOF' > src/components/mdx/Explanation.tsx
export default function Explanation({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 my-4">
      <strong className="block text-blue-700 mb-2">Explanation</strong>
      <div>{children}</div>
    </div>
  );
}
EOF

cat << 'EOF' > src/components/mdx/Quiz.tsx
import { useState } from 'react';

export default function Quiz({ question, answer }: { question: string; answer: string }) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');

  return (
    <div className="border rounded p-4 my-4">
      <p className="mb-2 font-semibold">{question}</p>
      <input
        className="border p-1 mr-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Your answer"
      />
      <button
        className="bg-gray-200 px-2 py-1 rounded"
        onClick={() => setStatus(value === answer ? '✅ Correct!' : '❌ Try again')}
      >
        Check
      </button>
      {status && <p className="mt-2 italic">{status}</p>}
    </div>
  );
}
EOF

echo "🔧 Updating MDXComponents to register new components..."
cat << 'EOF' > src/components/MDXComponents.tsx
import Explanation from './mdx/Explanation';
import Quiz from './mdx/Quiz';

const MDXComponents = {
  Explanation,
  Quiz,
};

export default MDXComponents;
EOF

echo "🧪 Test your calculators with:"
echo "👉  http://localhost:3000/embed/test"
echo "👉  Add <Explanation> and <Quiz question=\"...\" answer=\"...\" /> in your .mdx"

echo "✅ Phase 4 complete!"
