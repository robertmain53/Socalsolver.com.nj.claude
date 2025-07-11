import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function improveContentWithAI({ slug, content }: { slug: string, content: string }) {
  const prompt = `You are a calculator content editor. Improve the following educational content for clarity, tone, and structure.\n\n---\n\n${content}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful AI content editor.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content || content;
}
