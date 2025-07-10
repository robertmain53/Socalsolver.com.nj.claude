import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI();

export async function POST(req: Request) {
  const { slug, section, draft, notes } = await req.json();

  const prompt = `You are a content editor. Improve the ${section} section for "${slug}".
Notes from human: ${notes}
Original content: ${draft}
Return only the improved text.`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return NextResponse.json({ improved: chat.choices[0]?.message?.content });
}

