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
