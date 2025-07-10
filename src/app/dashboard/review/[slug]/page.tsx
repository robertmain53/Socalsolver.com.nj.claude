'use client';
import { useState } from 'react';

export default function ReviewPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [notes, setNotes] = useState('');
  const [improved, setImproved] = useState<string | null>(null);

  const improve = async () => {
    const res = await fetch('/api/improve', {
      method: 'POST',
      body: JSON.stringify({ slug, section: 'explain', draft: '', notes }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setImproved(data.improved || 'No result.');
  };

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Review: {slug}</h1>

      <label className="block font-semibold">💬 Editor Notes:</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 border rounded"
        rows={4}
      />

      <button
        onClick={improve}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        ✨ AI Improve Section
      </button>

      {improved && (
        <div className="mt-4 p-4 bg-gray-100 border rounded">
          <h2 className="font-bold">Improved Output</h2>
          <pre>{improved}</pre>
        </div>
      )}

      <form method="POST" action="/api/approve">
        <input type="hidden" name="slug" value={slug} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mt-4">
          ✅ Approve & Publish
        </button>
      </form>
    </div>
  );
}

