import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content/calculators');

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const filePath = path.join(contentDir, `${params.slug}.mdx`);
  const content = await fs.readFile(filePath, 'utf8');
  return new NextResponse(content);
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const { content } = await req.json();
  const filePath = path.join(contentDir, `${params.slug}.mdx`);
  await fs.writeFile(filePath, content, 'utf8');
  return new NextResponse(JSON.stringify({ ok: true }));
}
