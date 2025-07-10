/**
 * API Version 2 - Latest and Greatest
 * Advanced features, better performance, enhanced security
 */

import express from 'express';
import { calculatorRoutes } from './calculators';
import { calculationRoutes } from './calculations';
import { userRoutes } from './users';
import { analyticsRoutes } from './analytics';
import { webhookRoutes } from './webhooks';
import { exportRoutes } from './exports';
import { batchRoutes } from './batch';

const router = express.Router();

// API v2 welcome message
router.get('/', (req, res) => {
 res.json({
 message: 'Welcome to Calculator API v2',
 version: '2.0.0',
 features: [
 'Enhanced performance',
 'Advanced analytics',
 'Batch processing',
 'Custom formulas',
 'Real-time webhooks',
 'Data export formats'
 ],
 documentation: 'https://docs.yourcalculatorsite.com/api/v2',
 changelog: 'https://docs.yourcalculatorsite.com/api/changelog'
 });
});

// Route handlers
router.use('/calculators', calculatorRoutes);
router.use('/calculate', calculationRoutes);
router.use('/calculations', calculationRoutes); // Alias for RESTful naming
router.use('/users', userRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/export', exportRoutes);
router.use('/batch', batchRoutes);

export default router;
