// src/app/review/[slug]/actions.ts
'use server';

import fs from 'fs/promises';
import path from 'path';

export async function saveReview({
  slug,
  reviewer,
  comment,
  original,
  improved,
  status,
}: {
  slug: string;
  reviewer: string;
  comment: string;
  original: string;
  improved: string;
  status: 'approved' | 'rejected';
}) {
  const log = {
    slug,
    reviewer,
    comment,
    status,
    original,
    improved,
    timestamp: new Date().toISOString(),
  };

  const reviewsDir = path.join(process.cwd(), 'reviews');
  await fs.mkdir(reviewsDir, { recursive: true });

  const filePath = path.join(reviewsDir, `${slug}-${Date.now()}.json`);
  await fs.writeFile(filePath, JSON.stringify(log, null, 2), 'utf-8');
}
