// File: src/app/dashboard/review/page.tsx
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';

export default async function ReviewDashboard() {
  const files = await fs.readdir('content/calculators');
  const slugs = files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🧾 Calculators to Review</h1>
      <ul className="space-y-2">
        {slugs.map(slug => (
          <li key={slug}>
            <Link
              className="text-blue-600 underline"
              href={`/dashboard/review/${slug}`}
            >
              {slug}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
