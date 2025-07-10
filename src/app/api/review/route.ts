// src/app/api/review/route.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI();
const logsDir = path.join(process.cwd(), 'logs');

export async function POST(req: Request) {
  const { slug } = await req.json();
  const filePath = path.join(process.cwd(), 'content/calculators', `${slug}.mdx`);

  try {
    const mdx = await fs.readFile(filePath, 'utf8');
    const { content, data: frontmatter } = matter(mdx);

    const prompt = `
You are an expert reviewer of educational math content.
Review this calculator content for the following:

- Are frontmatter fields valid?
- Is the math accurate?
- Are there hallucinations, vague claims, or missing steps?
- Is the tone aligned with “Socratic, clear, helpful”?
- Suggest 2-3 concrete improvements.

--- Frontmatter ---
${JSON.stringify(frontmatter)}

--- Content ---
${content}
`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const output = chat.choices[0]?.message?.content;
    const timestamp = new Date().toISOString();

    const log = {
      calculator: slug,
      timestamp,
      reviewer: 'AI',
      actions: output?.split('\n').filter(Boolean),
      status: 'reviewed',
    };

    await fs.mkdir(logsDir, { recursive: true });
    await fs.writeFile(path.join(logsDir, `${slug}.${timestamp}.review.json`), JSON.stringify(log, null, 2));

    return NextResponse.json(log);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

