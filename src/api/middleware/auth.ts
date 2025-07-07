/**
 * Authentication Middleware
 * Handles API key validation, JWT tokens, and user permissions
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    tier: 'free' | 'pro' | 'enterprise';
    permissions: string[];
  };
  apiKey?: string;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Skip auth for public endpoints
    if (isPublicEndpoint(req.path)) {
      return next();
    }

    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'] as string;

    if (!authHeader && !apiKey) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'MISSING_CREDENTIALS',
        message: 'Please provide either Authorization header or X-API-Key'
      });
    }

    // Handle API Key authentication
    if (apiKey) {
      const keyData = await validateApiKey(apiKey);
      if (!keyData) {
        return res.status(401).json({
          error: 'Invalid API key',
          code: 'INVALID_API_KEY'
        });
      }

      req.user = keyData.user;
      req.apiKey = apiKey;
      
      return next();
    }

    // Handle JWT token authentication
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const user = await getUserById(decoded.userId);
        
        if (!user) {
          return res.status(401).json({
            error: 'Invalid token',
            code: 'INVALID_TOKEN'
          });
        }

        req.user = user;
        return next();

      } catch (jwtError) {
        return res.status(401).json({
          error: 'Invalid or expired token',
          code: 'TOKEN_EXPIRED'
        });
      }
    }

    res.status(401).json({
      error: 'Invalid authentication format',
      code: 'INVALID_AUTH_FORMAT'
    });

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication service unavailable',
      code: 'AUTH_SERVICE_ERROR'
    });
  }
};

function isPublicEndpoint(path: string): boolean {
  const publicPaths = [
    '/health',
    '/info',
    '/documentation'
  ];
  
  return publicPaths.some(publicPath => path.startsWith(publicPath));
}

async function validateApiKey(apiKey: string): Promise<any> {
  // Implementation depends on your database
  return null;
}

async function getUserById(userId: string): Promise<any> {
  // Implementation depends on your database
  return null;
}
