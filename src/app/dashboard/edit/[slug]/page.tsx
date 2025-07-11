import { MDXRemote } from 'next-mdx-remote/rsc';
import CalculatorTest from '@/components/calculators/CalculatorTest';
import EditorClient from '@/components/dashboard/EditorClient';

export default async function EditPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const contentRes = await fetch(`http://localhost:3000/api/content/${slug}`, {
    cache: 'no-store'
  });
  const content = await contentRes.text();

  const statusRes = await fetch(`http://localhost:3000/api/status/${slug}`, {
    cache: 'no-store'
  });
  const status = await statusRes.json();

  return (
    <div className="max-w-screen-xl mx-auto p-8 space-y-10">
      <h1 className="text-2xl font-bold">✍️ Editing: {slug}</h1>

      {/* Inline Editor */}
      <EditorClient
        slug={slug}
        initialContent={content}
        initialStatus={status}
      />

      {/* Live Preview */}
      <div className="border-t pt-10">
        <h2 className="text-xl font-semibold mb-2">🧪 Live Preview</h2>
        <div className="prose">
          <MDXRemote source={content} components={{ CalculatorTest }} />
        </div>
      </div>
    </div>
  );
}
