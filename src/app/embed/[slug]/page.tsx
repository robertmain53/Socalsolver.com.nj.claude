import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import MDXComponents from '@/components/MDXComponents';

export default async function EmbedPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content/calculators', `${slug}.mdx`);

  try {
    const file = await fs.readFile(filePath, 'utf-8');
    const { content } = await compileMDX({ source: file, components: MDXComponents });
    return (
      <html lang="en">
        <body style={{ margin: 0 }}>
          <div className="p-4 max-w-xl mx-auto">
            {content}
          </div>
        </body>
      </html>
    );
  } catch {
    notFound();
  }
}
