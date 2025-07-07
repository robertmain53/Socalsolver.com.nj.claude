import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    name: 'Calculator API',
    version: '2.0.0',
    description: 'Advanced calculator API with comprehensive features',
    documentation: '/api/docs',
    endpoints: {
      health: '/api/health',
      v2: '/api/v2'
    },
    features: [
      'Real-time calculations',
      'Batch processing',
      'Custom formulas',
      'Data export',
      'Analytics'
    ]
  });
}
