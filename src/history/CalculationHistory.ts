/**
 * Calculation History System
 * Advanced history tracking with analytics, sharing, and organization
 */

import { Schema, model, Document } from 'mongoose';

export interface ICalculationHistory extends Document {
  userId: string;
  calculatorId: string;
  calculatorName: string;
  
  // Calculation Details
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  formattedOutputs: Record<string, string>;
  
  // Metadata
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Performance
  calculationTime: number; // milliseconds
  cacheHit: boolean;
  apiVersion: string;
  
  // Organization
  tags: string[];
  notes: string;
  isBookmarked: boolean;
  isShared: boolean;
  shareId?: string;
  
  // Privacy
  isPrivate: boolean;
  
  // Related calculations
  sessionId: string;
  previousCalculationId?: string;
  relatedCalculations: string[];
  
  // Export history
  exports: Array<{
    format: 'pdf' | 'excel' | 'csv' | 'json';
    timestamp: Date;
    downloadCount: number;
  }>;
}

const CalculationHistorySchema = new Schema<ICalculationHistory>({
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  
  calculatorId: { 
    type: String, 
    required: true,
    index: true 
  },
  
  calculatorName: { 
    type: String, 
    required: true 
  },
  
  inputs: {
    type: Schema.Types.Mixed,
    required: true
  },
  
  outputs: {
    type: Schema.Types.Mixed,
    required: true
  },
  
  formattedOutputs: {
    type: Schema.Types.Mixed,
    default: {}
  },
  
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  ipAddress: { type: String },
  userAgent: { type: String },
  
  location: {
    country: { type: String },
    city: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  
  calculationTime: { type: Number },
  cacheHit: { type: Boolean, default: false },
  apiVersion: { type: String, default: '2.0' },
  
  tags: [{ type: String }],
  notes: { type: String, maxlength: 1000 },
  isBookmarked: { type: Boolean, default: false },
  isShared: { type: Boolean, default: false },
  shareId: { type: String, unique: true, sparse: true },
  
  isPrivate: { type: Boolean, default: true },
  
  sessionId: { type: String, index: true },
  previousCalculationId: { type: String },
  relatedCalculations: [{ type: String }],
  
  exports: [{
    format: {
      type: String,
      enum: ['pdf', 'excel', 'csv', 'json'],
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    downloadCount: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
CalculationHistorySchema.index({ userId: 1, timestamp: -1 });
CalculationHistorySchema.index({ calculatorId: 1, timestamp: -1 });
CalculationHistorySchema.index({ sessionId: 1 });
CalculationHistorySchema.index({ shareId: 1 });
CalculationHistorySchema.index({ tags: 1 });
CalculationHistorySchema.index({ isBookmarked: 1, userId: 1 });

// Virtual fields
CalculationHistorySchema.virtual('shareUrl').get(function() {
  if (!this.shareId) return null;
  return `${process.env.FRONTEND_URL}/shared/${this.shareId}`;
});

CalculationHistorySchema.virtual('totalExports').get(function() {
  return this.exports.reduce((total, exp) => total + exp.downloadCount, 0);
});

// Instance methods
CalculationHistorySchema.methods.generateShareId = async function(): Promise<string> {
  if (this.shareId) return this.shareId;
  
  const shareId = require('crypto').randomBytes(16).toString('hex');
  this.shareId = shareId;
  this.isShared = true;
  await this.save();
  
  return shareId;
};

CalculationHistorySchema.methods.addExport = async function(format: string): Promise<void> {
  const existingExport = this.exports.find(exp => exp.format === format);
  
  if (existingExport) {
    existingExport.downloadCount += 1;
    existingExport.timestamp = new Date();
  } else {
    this.exports.push({
      format,
      timestamp: new Date(),
      downloadCount: 1
    });
  }
  
  await this.save();
};

CalculationHistorySchema.methods.addRelatedCalculation = async function(calculationId: string): Promise<void> {
  if (!this.relatedCalculations.includes(calculationId)) {
    this.relatedCalculations.push(calculationId);
    await this.save();
  }
};

export const CalculationHistory = model<ICalculationHistory>('CalculationHistory', CalculationHistorySchema);

/**
 * History Service for managing calculation history
 */
export class HistoryService {
  
  async saveCalculation(data: {
    userId: string;
    calculatorId: string;
    calculatorName: string;
    inputs: any;
    outputs: any;
    metadata: any;
  }): Promise<ICalculationHistory> {
    
    const history = new CalculationHistory({
      ...data,
      timestamp: new Date(),
      sessionId: data.metadata.sessionId || this.generateSessionId(),
      calculationTime: data.metadata.duration || 0,
      cacheHit: data.metadata.cached || false,
      ipAddress: data.metadata.ipAddress,
      userAgent: data.metadata.userAgent,
      location: await this.getLocationFromIP(data.metadata.ipAddress)
    });
    
    await history.save();
    
    // Link to previous calculation in session if exists
    await this.linkToPreviousCalculation(history);
    
    return history;
  }
  
  async getUserHistory(userId: string, options: {
    page?: number;
    limit?: number;
    calculatorId?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    tags?: string[];
    bookmarked?: boolean;
  } = {}): Promise<{
    calculations: ICalculationHistory[];
    total: number;
    page: number;
    pages: number;
  }> {
    
    const {
      page = 1,
      limit = 20,
      calculatorId,
      startDate,
      endDate,
      search,
      tags,
      bookmarked
    } = options;
    
    // Build query
    const query: any = { userId };
    
    if (calculatorId) query.calculatorId = calculatorId;
    if (bookmarked) query.isBookmarked = true;
    if (tags && tags.length > 0) query.tags = { $in: tags };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }
    
    if (search) {
      query.$or = [
        { calculatorName: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const [calculations, total] = await Promise.all([
      CalculationHistory.find(query)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      CalculationHistory.countDocuments(query)
    ]);
    
    return {
      calculations,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }
  
  async getCalculationAnalytics(userId: string, period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<any> {
    const days = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[period];
    
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const pipeline = [
      {
        $match: {
          userId,
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            calculator: '$calculatorId',
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$timestamp'
              }
            }
          },
          count: { $sum: 1 },
          avgCalculationTime: { $avg: '$calculationTime' },
          totalTime: { $sum: '$calculationTime' }
        }
      },
      {
        $group: {
          _id: '$_id.calculator',
          totalCalculations: { $sum: '$count' },
          avgCalculationTime: { $avg: '$avgCalculationTime' },
          totalTime: { $sum: '$totalTime' },
          dailyBreakdown: {
            $push: {
              date: '$_id.date',
              count: '$count'
            }
          }
        }
      },
      {
        $sort: { totalCalculations: -1 }
      }
    ];
    
    const results = await CalculationHistory.aggregate(pipeline);
    
    return {
      period,
      summary: {
        totalCalculations: results.reduce((sum, r) => sum + r.totalCalculations, 0),
        uniqueCalculators: results.length,
        avgCalculationTime: results.reduce((sum, r) => sum + r.avgCalculationTime, 0) / results.length || 0,
        totalTime: results.reduce((sum, r) => sum + r.totalTime, 0)
      },
      calculatorBreakdown: results,
      timeline: this.generateTimeline(results, days)
    };
  }
  
  async shareCalculation(calculationId: string, userId: string): Promise<string> {
    const calculation = await CalculationHistory.findOne({
      _id: calculationId,
      userId
    });
    
    if (!calculation) {
      throw new Error('Calculation not found');
    }
    
    return await calculation.generateShareId();
  }
  
  async getSharedCalculation(shareId: string): Promise<ICalculationHistory | null> {
    return CalculationHistory.findOne({ shareId, isShared: true });
  }
  
  async exportUserData(userId: string, format: 'json' | 'csv'): Promise<any> {
    const calculations = await CalculationHistory.find({ userId })
      .sort({ timestamp: -1 })
      .lean();
    
    if (format === 'json') {
      return {
        exportDate: new Date().toISOString(),
        totalCalculations: calculations.length,
        calculations
      };
    } else {
      return this.convertToCSV(calculations);
    }
  }
  
  private async linkToPreviousCalculation(calculation: ICalculationHistory): Promise<void> {
    const previousCalculation = await CalculationHistory.findOne({
      userId: calculation.userId,
      sessionId: calculation.sessionId,
      timestamp: { $lt: calculation.timestamp }
    }).sort({ timestamp: -1 });
    
    if (previousCalculation) {
      calculation.previousCalculationId = previousCalculation._id;
      await calculation.save();
      
      // Add bidirectional relationship
      await previousCalculation.addRelatedCalculation(calculation._id);
    }
  }
  
  private async getLocationFromIP(ip: string): Promise<any> {
    // Implement IP geolocation service
    return null;
  }
  
  private generateSessionId(): string {
    return require('crypto').randomUUID();
  }
  
  private generateTimeline(results: any[], days: number): any[] {
    // Generate daily timeline with calculation counts
    const timeline = [];
    const now = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTotal = results.reduce((total, calculator) => {
        const dayData = calculator.dailyBreakdown.find((d: any) => d.date === dateStr);
        return total + (dayData ? dayData.count : 0);
      }, 0);
      
      timeline.unshift({
        date: dateStr,
        calculations: dayTotal
      });
    }
    
    return timeline;
  }
  
  private convertToCSV(calculations: any[]): string {
    if (calculations.length === 0) return '';
    
    const headers = ['Date', 'Calculator', 'Inputs', 'Outputs', 'Notes', 'Tags'];
    const rows = calculations.map(calc => [
      new Date(calc.timestamp).toISOString(),
      calc.calculatorName,
      JSON.stringify(calc.inputs),
      JSON.stringify(calc.outputs),
      calc.notes || '',
      calc.tags.join(';')
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }
}
