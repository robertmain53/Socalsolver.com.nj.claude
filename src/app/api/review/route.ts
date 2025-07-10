import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  const filePath = path.join(process.cwd(), 'content', 'calculators', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const file = fs.readFileSync(filePath, 'utf-8');

  const prompt = `You are a critical reviewer of educational content. Review this calculator content for accuracy, clarity, engagement, and SEO. Provide suggestions if needed:

${file}`;

  const review = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return NextResponse.json({ review: review.choices[0].message.content });
}
