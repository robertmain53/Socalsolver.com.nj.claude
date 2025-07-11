// src/lib/ai/review.ts – server-only utility
import OpenAI from 'openai';

const openai = new OpenAI();

export async function reviewContentWithAI({ slug }: { slug: string }) {
  const path = `content/calculators/${slug}.mdx`;
  const fs = await import('fs/promises');
  const content = await fs.readFile(path, 'utf-8');

  const prompt = [
    'You are an editorial AI reviewer.',
    'Analyse the following MDX and give rubric feedback:',
    '---',
    content,
    '---'
  ].join('\n');

  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }]
  });

  return chat.choices[0]?.message?.content ?? '';
}
