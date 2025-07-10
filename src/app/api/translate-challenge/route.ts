import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const { slug, locale, challenge } = await req.json();

  const prompt = `Translate this challenge into ${locale}. Keep structure and clarity.
Challenge:
${JSON.stringify(challenge)}

Translated version:`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return NextResponse.json({ translated: response.choices[0].message.content });
}
