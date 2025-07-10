import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, section, draft, notes } = req.body;
  // Placeholder — will use OpenAI to return improved version
  return res.status(200).json({
    improved: `[IMPROVED] ${section} section for ${slug} — (notes: ${notes})`
  });
}
