// No "use client" — this is a Server Component

import { readFile } from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import MDXComponents from '@/components/MDXComponents';
import EditorClient from '@/components/dashboard/EditorClient';

export default async function EditCalculatorPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // Load .mdx content
  const filePath = path.join(process.cwd(), 'content', 'calculators', `${slug}.mdx`);
  let content = '';
  try {
    content = readFile(filePath, 'utf8');
  } catch (err) {
    return notFound();
  }

  // Load .json status
  const statusPath = path.join(process.cwd(), 'content', 'status', `${slug}.json`);
  let status = { status: 'draft', editorNotes: '' };
  try {
    const raw =  readFile(statusPath, 'utf8');
    status = JSON.parse(raw);
  } catch {
    // fallback to defaults
  }

  return (
    <div className="max-w-screen-xl mx-auto p-8 space-y-10">
      <h1 className="text-2xl font-bold">✍️ Editing: {slug}</h1>

      {/* Client-side Editor UI */}
      <EditorClient slug={slug} initialContent={content} initialStatus={status} />

      {/* Live Preview */}
      <div>
        <h2 className="text-lg font-semibold">🔍 Live Preview</h2>
        <div className="prose dark:prose-invert bg-white p-4 border rounded">
          <MDXRemote source={content} components={MDXComponents} />
        </div>
      </div>
    </div>
  );
}
