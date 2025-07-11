// ✅ This is a server component
import EditorClient from '@/components/dashboard/EditorClient';

export default async function EditPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const contentRes = await fetch(`http://localhost:3000/api/content/${slug}`);
  const content = await contentRes.text();

  const statusRes = await fetch(`http://localhost:3000/api/status/${slug}`);
  const status = await statusRes.json();

  return (
    <EditorClient
      slug={slug}
      initialContent={content}
      initialStatus={status}
    />
  );
}
