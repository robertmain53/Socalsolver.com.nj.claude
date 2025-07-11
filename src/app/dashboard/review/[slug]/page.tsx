// File: src/app/dashboard/review/[slug]/page.tsx
import fs from 'fs/promises';
import path from 'path';
import ReviewClient from '@/components/dashboard/ReviewClient';

export default async function ReviewSlugPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const filePath = path.join('content/calculators', `${slug}.md`);
  const content = await fs.readFile(filePath, 'utf-8');

  return <ReviewClient slug={slug} initialContent={content} />;
}
