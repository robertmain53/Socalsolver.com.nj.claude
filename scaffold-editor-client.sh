#!/bin/bash

set -e

TARGET_DIR="src/components/dashboard"
TARGET_FILE="$TARGET_DIR/EditorClient.tsx"

echo "🔧 Ensuring target directory exists: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

echo "🛠️ Writing EditorClient.tsx to: $TARGET_FILE"

cat > "$TARGET_FILE" << 'EOF'
// ✅ Client Component
'use client';

import { useState } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import MDXComponents from '@/components/MDXComponents';

type Props = {
  slug: string;
  initialContent: string;
  initialStatus: {
    status: string;
    editorNotes: string;
  };
};

export default function EditorClient({ slug, initialContent, initialStatus }: Props) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState(initialStatus);
  const [diff, setDiff] = useState('');
  const [review, setReview] = useState('');
  const [saving, setSaving] = useState(false);

  const handleImprove = async () => {
    setSaving(true);
    const res = await fetch('/api/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, draft: content })
    });
    const data = await res.json();
    setDiff(data.diff || '');
    if (data.content) setContent(data.content);
    setSaving(false);
  };

  const handleReview = async () => {
    const res = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    });
    const data = await res.json();
    setReview(data.feedback || '');
  };

  const handleMetadataSave = async () => {
    await fetch('/api/status/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, status: status.status, editorNotes: status.editorNotes })
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto p-8 space-y-10">
      <h1 className="text-2xl font-bold">✍️ Editing: {slug}</h1>

      {/* Status + Notes Editor */}
      <div className="bg-gray-100 p-4 rounded border space-y-3">
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status.status}
            onChange={e => setStatus({ ...status, status: e.target.value })}
            className="mt-1 border px-2 py-1 rounded w-full"
          >
            <option value="draft">Draft</option>
            <option value="improved">Improved</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Editor Notes</label>
          <textarea
            value={status.editorNotes}
            onChange={e => setStatus({ ...status, editorNotes: e.target.value })}
            className="mt-1 border px-2 py-1 rounded w-full"
            rows={2}
          />
        </div>

        <button
          onClick={handleMetadataSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          💾 Save Metadata
        </button>
      </div>

      {/* Editor & Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="text-sm font-semibold">Markdown (.mdx)</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full h-[600px] border font-mono p-3 rounded"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Live Preview</label>
          <div className="prose dark:prose-invert p-3 border rounded h-[600px] overflow-auto bg-white">
            <MDXRemote source={content} components={MDXComponents} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleImprove}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          🤖 Improve with AI
        </button>
        <button
          onClick={handleReview}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          🧠 Run AI Review
        </button>
      </div>

      {/* Diff Viewer */}
      {diff && (
        <div className="bg-black text-green-400 font-mono p-4 whitespace-pre-wrap rounded">
          <h2 className="font-bold text-white mb-2">📊 AI Suggested Diff</h2>
          {diff}
        </div>
      )}

      {/* AI Feedback */}
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

echo "✅ EditorClient.tsx scaffolded and ready!"
