import { NextRequest, NextResponse } from 'next/server';
import { improveContentWithAI } from '@/lib/ai/improve';
import { diffLines } from 'diff';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { slug, content } = await req.json();

  const improved = await improveContentWithAI({ slug, content });

  const diff = diffLines(content, improved);
  return NextResponse.json({ improved, diff });
}
