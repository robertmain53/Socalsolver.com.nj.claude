import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, locale } = req.body;
  // Placeholder — later we'll translate with OpenAI
  return res.status(200).json({
    question: '[Translated question]',
    answer: '[Translated answer]'
  });
}
