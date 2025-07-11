'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StatusTable({ rows }: { rows: any[] }) {
  return (
    <table className="w-full border">
      <thead>
        <tr className="border-b bg-gray-100">
          <th className="p-2 text-left">Slug</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Last Updated</th>
          <th className="p-2 text-left">Reviewed By</th>
          <th className="p-2 text-left">Notes</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <CalculatorRow key={row.slug} row={row} />
        ))}
      </tbody>
    </table>
  );
}

function CalculatorRow({ row }: { row: any }) {
  const [reviewing, setReviewing] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');

  const handleReview = async () => {
    setReviewing(true);
    setReviewStatus('Reviewing...');

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        body: JSON.stringify({ slug: row.slug }),
      });
      const data = await res.json();
      setReviewStatus(data.status || 'Review complete');
    } catch (err) {
      setReviewStatus('Error');
    }

    setReviewing(false);
  };

  return (
    <tr className="border-t">
      <td className="p-2 font-mono">{row.slug}</td>
      <td className="p-2">{row.status}</td>
      <td className="p-2">{row.lastUpdated}</td>
      <td className="p-2">{row.reviewedBy || '—'}</td>
      <td className="p-2">{row.editorNotes || '—'}</td>
      <td className="p-2 flex gap-2">
        <Link href={`/dashboard/edit/${row.slug}`} className="text-blue-600 hover:underline">
          Edit
        </Link>
        <button
          onClick={handleReview}
          className="text-green-700 hover:underline"
          disabled={reviewing}
        >
          {reviewing ? '...' : 'Review'}
        </button>
        <span className="text-xs italic text-gray-500">{reviewStatus}</span>
      </td>
    </tr>
  );
}
