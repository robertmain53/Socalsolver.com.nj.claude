import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import MDXClient from '@/components/dashboard/MDXClient';     // 👈 new

export default async function EditPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const filePath = path.join(
    process.cwd(),
    'content/calculators',
    `${slug}.mdx`,
  );

  // ── read + compile MDX on the server ──────────────────────
  const raw = await fs.readFile(filePath, 'utf8');
  const { content } = matter(raw);
  const mdxSource = await serialize(content, { parseFrontmatter: true });

  // ── hand MDX to a *client* component for rendering ────────
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editing: {slug}</h1>
      {/* client-side rendering happens here */}
      <MDXClient mdx={mdxSource} />
    </div>
  );
}
