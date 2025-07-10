// 👇 Add this as the first line
'use client';

import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';

export default async function ReviewDashboard() {
  const files = await fs.readdir('content/calculators');
  const drafts = files.filter(f => f.endsWith('.mdx'));

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">📋 Drafts for Review</h1>
      <ul className="space-y-2">
        {drafts.map(file => {
          const slug = file.replace('.mdx', '');
          return (
            <li key={slug}>
              <Link href={`/dashboard/review/${slug}`} className="text-blue-600 underline">
                Review {slug}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
