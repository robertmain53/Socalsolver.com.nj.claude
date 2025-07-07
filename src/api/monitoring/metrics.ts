/**
 * API Monitoring and Metrics Collection
 * Real-time performance monitoring, error tracking, and business metrics
 */

import { Request, Response, NextFunction } from 'express';

interface MetricsCollector {
  recordRequest(method: string, endpoint: string, statusCode: number, duration: number): void;
  recordCalculation(calculatorId: string, duration: number, success: boolean): void;
  recordError(error: Error, context: any): void;
}

class APIMetrics implements MetricsCollector {
  private metrics: any = {};

  constructor() {
    this.initializeMetrics();
  }

  recordRequest(method: string, endpoint: string, statusCode: number, duration: number): void {
    console.log(`API Request: ${method} ${endpoint} - ${statusCode} (${duration}ms)`);
  }

  recordCalculation(calculatorId: string, duration: number, success: boolean): void {
    console.log(`Calculation: ${calculatorId} - ${success ? 'success' : 'failed'} (${duration}ms)`);
  }

  recordError(error: Error, context: any): void {
    console.error('API Error:', error.message, context);
  }

  private initializeMetrics(): void {
    this.metrics = {
      requests: 0,
      errors: 0,
      calculations: 0
    };
  }

  async getMetrics(): Promise<any> {
    return this.metrics;
  }
}

// Middleware for automatic request tracking
export function metricsMiddleware(metrics: APIMetrics) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      metrics.recordRequest(req.method, req.path, res.statusCode, duration);
    });

    next();
  };
}

// Export singleton instance
export const apiMetrics = new APIMetrics();
