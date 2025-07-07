import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    message: 'Welcome to Calculator API v2',
    version: '2.0.0',
    endpoints: {
      calculators: '/api/v2/calculators',
      calculate: '/api/v2/calculate',
      health: '/api/health'
    },
    documentation: '/api/docs'
  });
}
