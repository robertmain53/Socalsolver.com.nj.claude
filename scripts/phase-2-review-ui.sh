#!/usr/bin/env bash
set -e

echo "🧩 Scaffolding Phase 2: Review UI + Diff Viewer..."

mkdir -p src/app/review/[slug]
cat > src/app/review/[slug]/page.tsx <<'EOF'
import ReviewUI from '@/components/review/ReviewUI';
import { loadDiff } from '@/lib/review/loadDiff';

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { original, improved, diff } = await loadDiff(slug);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Review: {slug}</h1>
      <ReviewUI slug={slug} original={original} improved={improved} diff={diff} />
    </div>
  );
}
EOF

mkdir -p src/components/review
cat > src/components/review/ReviewUI.tsx <<'EOF'
'use client';
import React, { useState } from 'react';

export default function ReviewUI({ slug, original, improved, diff }: any) {
  const [status, setStatus] = useState('');

  const handleApprove = async () => {
    setStatus('Saving...');
    const res = await fetch('/api/review/log', {
      method: 'POST',
      body: JSON.stringify({ slug, approved: true }),
    });
    setStatus(res.ok ? 'Approved ✅' : 'Error');
  };

  const handleReject = async () => {
    setStatus('Saving...');
    const res = await fetch('/api/review/log', {
      method: 'POST',
      body: JSON.stringify({ slug, approved: false }),
    });
    setStatus(res.ok ? 'Rejected ❌' : 'Error');
  };

  return (
    <div>
      <div className="flex gap-6">
        <div className="w-1/2">
          <h2 className="font-semibold mb-2">Original</h2>
          <pre className="text-sm bg-gray-100 p-2 overflow-auto h-96">{original}</pre>
        </div>
        <div className="w-1/2">
          <h2 className="font-semibold mb-2">Improved</h2>
          <pre className="text-sm bg-green-50 p-2 overflow-auto h-96">{improved}</pre>
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Approve</button>
        <button onClick={handleReject} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reject</button>
        <span className="text-gray-600 italic">{status}</span>
      </div>
    </div>
  );
}
EOF

mkdir -p src/lib/review
cat > src/lib/review/loadDiff.ts <<'EOF'
import fs from 'fs/promises';
import path from 'path';
import { improveWithAI } from '@/lib/ai/improve';
import { diffLines } from 'diff';

export async function loadDiff(slug: string) {
  const filePath = path.join(process.cwd(), 'content/calculators', `${slug}.mdx`);
  const original = await fs.readFile(filePath, 'utf-8');
  const improved = await improveWithAI(original, slug);
  const diff = diffLines(original, improved);
  return { original, improved, diff };
}
EOF

cat > src/lib/review/logReview.ts <<'EOF'
export async function logReview({ slug, approved }: { slug: string, approved: boolean }) {
  console.log(`[REVIEW LOG] ${slug} → ${approved ? 'APPROVED' : 'REJECTED'}`);
  // TODO: Write to file or DB later
}
EOF

mkdir -p src/app/api/review/log
cat > src/app/api/review/log/route.ts <<'EOF'
import { logReview } from '@/lib/review/logReview';

export async function POST(req: Request) {
  const data = await req.json();
  await logReview(data);
  return new Response(JSON.stringify({ ok: true }));
}
EOF

echo "✅ Phase 2 UI setup complete. Open: /review/test"
