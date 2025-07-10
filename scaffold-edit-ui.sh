#!/bin/bash

echo "📁 Scaffolding AI-powered edit UI..."

# Paths
SERVER_PAGE="src/app/dashboard/edit/[slug]/page.tsx"
CLIENT_COMPONENT="src/components/dashboard/EditorClient.tsx"

# Create directories if needed
mkdir -p "$(dirname $SERVER_PAGE)"
mkdir -p "$(dirname $CLIENT_COMPONENT)"

# --- Create page.tsx ---
cat > "$SERVER_PAGE" <<EOF
import EditorClient from '@/components/dashboard/EditorClient';

export default async function EditCalculatorPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const [contentRes, statusRes] = await Promise.all([
    fetch(\`http://localhost:3000/api/content/\${slug}\`),
    fetch(\`http://localhost:3000/api/status/\${slug}\`)
  ]);

  const content = await contentRes.text();
  const status = await statusRes.json();

  return <EditorClient slug={slug} initialContent={content} initialStatus={status} />;
}
EOF

# --- Create EditorClient.tsx ---
cat > "$CLIENT_COMPONENT" <<EOF
'use client';

import { useState } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import MDXComponents from '@/components/MDXComponents';

export default function EditorClient({ slug, initialContent, initialStatus }) {
  const [content, setContent] = useState(initialContent || '');
  const [status, setStatus] = useState(initialStatus || { status: 'draft', editorNotes: '' });
  const [diff, setDiff] = useState('');
  const [review, setReview] = useState('');
  const [saving, setSaving] = useState(false);

  const handleImprove = async () => {
    setSaving(true);
    const res = await fetch('/api/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, draft: content }),
    });
    const data = await res.json();
    if (data.content) setContent(data.content);
    setDiff(data.diff || '');
    setSaving(false);
  };

  const handleReview = async () => {
    const res = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    const data = await res.json();
    setReview(data.feedback || '');
  };

  const handleMetadataSave = async () => {
    await fetch('/api/status/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        status: status.status,
        editorNotes: status.editorNotes,
      }),
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto p-8 space-y-10">
      <h1 className="text-2xl font-bold">✍️ Editing: {slug}</h1>

      <div className="bg-gray-100 p-4 rounded border space-y-3">
        <select
          value={status.status}
          onChange={(e) => setStatus({ ...status, status: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="draft">Draft</option>
          <option value="improved">Improved</option>
          <option value="approved">Approved</option>
          <option value="published">Published</option>
        </select>

        <textarea
          value={status.editorNotes}
          onChange={(e) => setStatus({ ...status, editorNotes: e.target.value })}
          className="w-full p-2 border rounded"
          rows={2}
        />

        <button
          onClick={handleMetadataSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          💾 Save Metadata
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[600px] border font-mono p-3 rounded"
        />

        <div className="prose dark:prose-invert border rounded p-4 bg-white h-[600px] overflow-auto">
          <MDXRemote source={content} components={MDXComponents} />
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={handleImprove} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">
          🤖 Improve with AI
        </button>
        <button onClick={handleReview} className="bg-purple-600 text-white px-4 py-2 rounded">
          🧠 Run AI Rubric Review
        </button>
      </div>

      {diff && (
        <pre className="bg-black text-green-400 p-4 whitespace-pre-wrap font-mono rounded">
          {diff}
        </pre>
      )}

      {review && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <h2 className="text-yellow-700 font-bold mb-2">📋 AI Rubric Feedback</h2>
          <pre className="whitespace-pre-wrap text-sm">{review}</pre>
        </div>
      )}
    </div>
  );
}
EOF

echo "✅ Scaffold complete:"
echo " - Server route: $SERVER_PAGE"
echo " - Client editor: $CLIENT_COMPONENT"
