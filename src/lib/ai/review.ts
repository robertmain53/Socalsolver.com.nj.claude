import { OpenAI } from 'openai'
const openai = new OpenAI()

export async function reviewContentWithAI({ slug }: { slug: string }) {
  const path = \`content/calculators/\${slug}.mdx\`
  const content = await (await import('fs/promises')).readFile(path, 'utf-8')
  const prompt = `
You are an editorial AI reviewer.
Evaluate the following content across:
- Clarity
- Educational tone
- Formula accuracy
- SEO best practices
- Schema compliance

Give concise, structured feedback.

${content}
  `
  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  })
  return { feedback: res.choices[0].message.content }
}
