import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const { slug, section, draft, notes } = await req.json();

  const prompt = `You are an expert educator. Improve the "${section}" section of the calculator "${slug}".
Notes: ${notes}
Original content:
${draft}

Improved version:`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return NextResponse.json({ improved: completion.choices[0].message.content });
}
