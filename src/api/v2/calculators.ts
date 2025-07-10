/**
 * Calculator Management API
 * CRUD operations for calculators with advanced features
 */

import express from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import { cacheMiddleware } from '../middleware/cache';

const router = express.Router();

// Validation schemas
const CalculatorQuerySchema = z.object({
 category: z.string().optional(),
 featured: z.boolean().optional(),
 search: z.string().optional(),
 page: z.number().min(1).default(1),
 limit: z.number().min(1).max(100).default(20),
 sort: z.enum(['name', 'category', 'popularity', 'created']).default('name'),
 order: z.enum(['asc', 'desc']).default('asc')
});

// GET /api/v2/calculators - List all calculators
router.get('/', 
 cacheMiddleware(300), // Cache for 5 minutes
 validateRequest({ query: CalculatorQuerySchema }),
 async (req, res) => {
 try {
 const {
 category,
 featured,
 search,
 page,
 limit,
 sort,
 order
 } = req.query as z.infer<typeof CalculatorQuerySchema>;

 // Build query
 const query: any = {};
 if (category) query.category = category;
 if (featured !== undefined) query.featured = featured;
 if (search) {
 query.$or = [
 { title: { $regex: search, $options: 'i' } },
 { description: { $regex: search, $options: 'i' } },
 { 'metadata.tags': { $in: [new RegExp(search, 'i')] } }
 ];
 }

 // Calculate pagination
 const skip = (page - 1) * limit;
 
 // Get calculators with pagination
 const [calculators, total] = await Promise.all([
 getCalculators(query, { skip, limit, sort, order }),
 countCalculators(query)
 ]);

 res.json({
 calculators,
 pagination: {
 page,
 limit,
 total,
 pages: Math.ceil(total / limit),
 hasNext: page * limit < total,
 hasPrev: page > 1
 },
 meta: {
 query: req.query,
 cached: res.locals.cached || false
 }
 });

 } catch (error) {
 res.status(500).json({
 error: 'Failed to fetch calculators',
 details: error.message
 });
 }
 }
);

// Utility functions (implement based on your database)
async function getCalculators(query: any, options: any): Promise<any[]> {
 // Implementation depends on your database
 return [];
}

async function countCalculators(query: any): Promise<number> {
 return 0;
}

export { router as calculatorRoutes };
