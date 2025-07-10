import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.body;
  // Placeholder review result
  return res.status(200).json({
    rubric: {
      clarity: 4,
      depth: 5,
      accuracy: 5
    },
    summary: 'Well explained. A few points could be clearer.'
  });
}
