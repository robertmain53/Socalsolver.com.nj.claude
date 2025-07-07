/**
 * API Router with Versioning Support
 * Handles routing for multiple API versions and provides backwards compatibility
 */

import express from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from './middleware/auth';
import { analyticsMiddleware } from './middleware/analytics';
import { validationMiddleware } from './middleware/validation';
import { errorHandler } from './middleware/error-handler';

// Import API versions
import v1Routes from './v1';
import v2Routes from './v2';

const router = express.Router();

// Global middleware
router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ extended: true }));

// Rate limiting
const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.headers['x-api-key'] as string || req.ip;
    }
  });
};

// Apply rate limits based on API version and tier
router.use('/v1', createRateLimit(15 * 60 * 1000, 100, 'Rate limit exceeded for API v1'));
router.use('/v2', createRateLimit(15 * 60 * 1000, 1000, 'Rate limit exceeded for API v2'));

// Authentication middleware
router.use(authMiddleware);

// Analytics tracking
router.use(analyticsMiddleware);

// API Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '2.0.0',
    uptime: process.uptime()
  });
});

// API Info endpoint
router.get('/info', (req, res) => {
  res.json({
    name: 'Calculator API',
    version: '2.0.0',
    description: 'Advanced calculator API with comprehensive features',
    documentation: 'https://docs.yourcalculatorsite.com/api',
    support: 'https://support.yourcalculatorsite.com',
    status: 'https://status.yourcalculatorsite.com',
    endpoints: {
      v1: '/api/v1',
      v2: '/api/v2'
    },
    features: [
      'Real-time calculations',
      'Batch processing',
      'Custom formulas',
      'Data export',
      'Webhooks',
      'Analytics'
    ]
  });
});

// Version-specific routes
router.use('/v1', v1Routes);
router.use('/v2', v2Routes);

// Error handling
router.use(errorHandler);

export default router;
