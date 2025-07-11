'use client';

import { useState } from 'react';

export default function ReviewClient({
  slug,
  initialContent
}: {
  slug: string;
  initialContent: string;
}) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    const res = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    });
    const data = await res.json();
    setFeedback(data.feedback || 'No feedback found.');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧠 Reviewing: {slug}</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap mb-4">
        {initialContent}
      </pre>

      <button
        onClick={handleReview}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        🧪 Run AI Review
      </button>

      {feedback && (
        <div className="bg-yellow-50 mt-6 p-4 border-l-4 border-yellow-500 rounded">
          <h2 className="font-bold text-yellow-700 mb-2">📋 AI Feedback</h2>
          <pre className="text-sm whitespace-pre-wrap">{feedback}</pre>
        </div>
      )}
    </div>
  );
}
