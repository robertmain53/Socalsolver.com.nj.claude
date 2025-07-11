'use client';
import { useState } from 'react';
import { saveReview } from './actions';

function DiffLine({ line }: { line: string }) {
  const color = line.startsWith('+')
    ? 'bg-green-100 text-green-800'
    : line.startsWith('-')
    ? 'bg-red-100 text-red-800'
    : '';
  return <pre className={`px-2 py-1 font-mono ${color}`}>{line}</pre>;
}

export default function ReviewPage({ original, improved, diff, slug }) {
  const [reviewer, setReviewer] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');

  async function handleAction(action: 'approved' | 'rejected') {
    await saveReview({ slug, reviewer, comment, original, improved, status: action });
    setStatus(action);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reviewing: {slug}</h1>

      <label className="block mb-2">Your name</label>
      <input
        value={reviewer}
        onChange={(e) => setReviewer(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
        placeholder="Reviewer name"
      />

      <label className="block mb-2">Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-6 p-2 border rounded w-full"
        rows={3}
        placeholder="Why approve or reject?"
      />

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleAction('approved')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Approve
        </button>
        <button
          onClick={() => handleAction('rejected')}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          ❌ Reject
        </button>
      </div>

      {status && <p className="italic text-gray-600">✅ {status} saved</p>}

      <div className="mt-8 space-y-1">
        {(diff ?? []).map((line, i) => (
          <DiffLine key={i} line={line} />
        ))}

      </div>
    </div>
  );
}
