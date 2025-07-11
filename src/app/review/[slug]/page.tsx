import ReviewClient from '@/components/dashboard/ReviewClient';
import { loadDiff } from '@/lib/review/loadDiff';

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { original, improved, diff } = await loadDiff(slug);

  return (
    <ReviewClient
      slug={slug}
      original={original}
      improved={improved}
      diff={diff}
    />
  );
}
