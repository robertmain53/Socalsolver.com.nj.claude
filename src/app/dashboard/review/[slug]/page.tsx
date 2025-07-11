import { MDXRemote } from 'next-mdx-remote/rsc';
import CalculatorTest from '@/components/calculators/CalculatorTest';

export default async function EditPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const contentRes = await fetch(`http://localhost:3000/api/content/${slug}`);
  const content = await contentRes.text();

  return (
    <div className="max-w-screen-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Editing: {slug}</h1>

      <MDXRemote source={content} components={{ CalculatorTest }} />
    </div>
  );
}
