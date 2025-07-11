import { improveContent } from '@/lib/ai/improve'
export const runtime = 'nodejs'
export async function POST(req: Request) {
  const { slug, content } = await req.json()
  const improved = await improveContent(slug, content)
  return Response.json({ improved })
}
