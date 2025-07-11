import ReviewUI from '@/components/review/ReviewUI';
import { loadDiff } from '@/lib/review/loadDiff';

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { original, improved, diff } = await loadDiff(slug);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Review: {slug}</h1>
      <ReviewUI slug={slug} original={original} improved={improved} diff={diff} />
    </div>
  );
}
