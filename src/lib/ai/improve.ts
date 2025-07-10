import { OpenAI } from 'openai'
const openai = new OpenAI()

export async function improveContentWithAI({ slug, draft }: { slug: string, draft: string }) {
  const prompt = `Improve the following markdown content. Fix clarity, tone, grammar, structure. Output only the improved version.\n\n${draft}`
  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  })
  return { content: res.choices[0].message.content, diff: 'AI improvement applied.' }
}
