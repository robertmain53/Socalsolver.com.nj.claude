

import { useState } from 'react';
import Link from 'next/link';

export default function CalculatorRow({ row }: { row: any }) {
  const [reviewing, setReviewing] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');

  const handleReview = async () => {
    setReviewing(true);
    setReviewStatus('Reviewing...');
    const res = fetch('/api/review', {
      method: 'POST',
      body: JSON.stringify({ slug: row.slug }),
    });
    const data = res.json();
    setReviewStatus(data.status || 'Review complete');
    setReviewing(false);
  };

  return (
    <tr key={row.slug} className="border-t">
      <td className="p-2 font-mono">{row.slug}</td>
      <td className="p-2">{row.status}</td>
      <td className="p-2">{row.lastUpdated}</td>
      <td className="p-2">{row.reviewedBy || '—'}</td>
      <td className="p-2">{row.editorNotes || '—'}</td>
      <td className="p-2 flex gap-2">
        <Link href={`/dashboard/edit/${row.slug}`} className="text-blue-600 hover:underline">Edit</Link>
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
