'use client';

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
