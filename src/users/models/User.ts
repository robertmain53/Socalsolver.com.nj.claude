/**
 * Comprehensive User Model
 * Advanced user management with preferences, subscriptions, and analytics
 */

import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  // Basic Information
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  
  // Account Details
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'pending_verification';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  
  // Subscription Information
  subscription: {
    plan: string;
    status: 'active' | 'cancelled' | 'past_due' | 'trialing';
    currentPeriodEnd: Date;
    customerId?: string; // Stripe customer ID
    subscriptionId?: string;
    trialEndsAt?: Date;
  };
  
  // Usage Statistics
  usage: {
    calculationsThisMonth: number;
    apiCallsThisMonth: number;
    storageUsedMB: number;
    lastResetDate: Date;
  };
  
  // Personalization
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    notifications: {
      email: boolean;
      browser: boolean;
      mobile: boolean;
      marketing: boolean;
    };
    privacy: {
      shareUsageData: boolean;
      allowRecommendations: boolean;
      publicProfile: boolean;
    };
  };
  
  // Collections and Favorites
  collections: {
    favorites: string[]; // Calculator IDs
    custom: Array<{
      id: string;
      name: string;
      description?: string;
      calculators: string[];
      isPublic: boolean;
      createdAt: Date;
    }>;
  };
  
  // API Keys
  apiKeys: Array<{
    id: string;
    name: string;
    key: string;
    permissions: string[];
    lastUsed?: Date;
    createdAt: Date;
    expiresAt?: Date;
    rateLimit?: {
      requestsPerHour: number;
      requestsPerDay: number;
    };
  }>;
  
  // Security
  security: {
    lastLogin: Date;
    loginHistory: Array<{
      timestamp: Date;
      ip: string;
      userAgent: string;
      location?: string;
      success: boolean;
    }>;
    passwordChangedAt: Date;
    failedLoginAttempts: number;
    lockedUntil?: Date;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
  
  // Methods
  comparePassword(password: string): Promise<boolean>;
  generateJWT(): string;
  generateAPIKey(name: string, permissions: string[]): Promise<any>;
  updateUsage(type: 'calculation' | 'apiCall', amount?: number): Promise<void>;
  canPerformAction(action: string): boolean;
  getRecommendations(): Promise<any[]>;
  exportData(format: 'json' | 'csv'): Promise<any>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: 'Invalid email format'
    }
  },
  
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: (password: string) => {
        // Strong password validation
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  
  name: { type: String, trim: true },
  avatar: { type: String },
  
  tier: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending_verification'],
    default: 'pending_verification'
  },
  
  emailVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  
  subscription: {
    plan: { type: String, default: 'free' },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'past_due', 'trialing'],
      default: 'active'
    },
    currentPeriodEnd: { type: Date },
    customerId: { type: String },
    subscriptionId: { type: String },
    trialEndsAt: { type: Date }
  },
  
  usage: {
    calculationsThisMonth: { type: Number, default: 0 },
    apiCallsThisMonth: { type: Number, default: 0 },
    storageUsedMB: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' },
    dateFormat: { type: String, default: 'MM/DD/YYYY' },
    notifications: {
      email: { type: Boolean, default: true },
      browser: { type: Boolean, default: true },
      mobile: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false }
    },
    privacy: {
      shareUsageData: { type: Boolean, default: false },
      allowRecommendations: { type: Boolean, default: true },
      publicProfile: { type: Boolean, default: false }
    }
  },
  
  collections: {
    favorites: [{ type: String }],
    custom: [{
      id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String },
      calculators: [{ type: String }],
      isPublic: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  
  apiKeys: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
    lastUsed: { type: Date },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    rateLimit: {
      requestsPerHour: { type: Number },
      requestsPerDay: { type: Number }
    }
  }],
  
  security: {
    lastLogin: { type: Date },
    loginHistory: [{
      timestamp: { type: Date, required: true },
      ip: { type: String, required: true },
      userAgent: { type: String, required: true },
      location: { type: String },
      success: { type: Boolean, required: true }
    }],
    passwordChangedAt: { type: Date, default: Date.now },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ 'apiKeys.key': 1 });
UserSchema.index({ tier: 1, status: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual fields
UserSchema.virtual('isLocked').get(function() {
  return this.security.lockedUntil && this.security.lockedUntil > new Date();
});

UserSchema.virtual('daysUntilTrialEnd').get(function() {
  if (!this.subscription.trialEndsAt) return null;
  const diff = this.subscription.trialEndsAt.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

UserSchema.virtual('usagePercentage').get(function() {
  const limits = getTierLimits(this.tier);
  return {
    calculations: (this.usage.calculationsThisMonth / limits.calculations) * 100,
    apiCalls: (this.usage.apiCallsThisMonth / limits.apiCalls) * 100,
    storage: (this.usage.storageUsedMB / limits.storageGB * 1024) * 100
  };
});

// Pre-save middleware
UserSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.security.passwordChangedAt = new Date();
  }
  
  // Reset usage monthly
  const now = new Date();
  const lastReset = this.usage.lastResetDate;
  if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
    this.usage.calculationsThisMonth = 0;
    this.usage.apiCallsThisMonth = 0;
    this.usage.lastResetDate = now;
  }
  
  this.lastActiveAt = new Date();
  next();
});

// Instance methods
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateJWT = function(): string {
  return jwt.sign(
    { 
      userId: this._id,
      email: this.email,
      tier: this.tier 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

UserSchema.methods.generateAPIKey = async function(name: string, permissions: string[] = []): Promise<any> {
  const keyId = require('crypto').randomUUID();
  const apiKey = `calc_${Buffer.from(`${this._id}:${keyId}:${Date.now()}`).toString('base64url')}`;
  
  const newKey = {
    id: keyId,
    name,
    key: apiKey,
    permissions,
    createdAt: new Date()
  };
  
  this.apiKeys.push(newKey);
  await this.save();
  
  return newKey;
};

UserSchema.methods.updateUsage = async function(type: 'calculation' | 'apiCall', amount: number = 1): Promise<void> {
  if (type === 'calculation') {
    this.usage.calculationsThisMonth += amount;
  } else if (type === 'apiCall') {
    this.usage.apiCallsThisMonth += amount;
  }
  
  await this.save();
};

UserSchema.methods.canPerformAction = function(action: string): boolean {
  const limits = getTierLimits(this.tier);
  
  switch (action) {
    case 'calculate':
      return this.usage.calculationsThisMonth < limits.calculations;
    case 'api_call':
      return this.usage.apiCallsThisMonth < limits.apiCalls;
    case 'create_collection':
      return this.collections.custom.length < limits.collections;
    case 'export_data':
      return this.tier !== 'free' || this.usage.calculationsThisMonth < 10;
    default:
      return true;
  }
};

UserSchema.methods.getRecommendations = async function(): Promise<any[]> {
  if (!this.preferences.privacy.allowRecommendations) {
    return [];
  }
  
  // Implementation would analyze user's calculation history
  // and recommend relevant calculators
  return [];
};

UserSchema.methods.exportData = async function(format: 'json' | 'csv'): Promise<any> {
  const exportData = {
    profile: {
      email: this.email,
      name: this.name,
      tier: this.tier,
      createdAt: this.createdAt
    },
    preferences: this.preferences,
    collections: this.collections,
    usage: this.usage
  };
  
  if (format === 'json') {
    return exportData;
  } else if (format === 'csv') {
    // Convert to CSV format
    return convertToCSV(exportData);
  }
};

function getTierLimits(tier: string) {
  const limits = {
    free: {
      calculations: 100,
      apiCalls: 500,
      storageGB: 0.1,
      collections: 3,
      exports: 2
    },
    pro: {
      calculations: 10000,
      apiCalls: 50000,
      storageGB: 5,
      collections: 25,
      exports: 50
    },
    enterprise: {
      calculations: Infinity,
      apiCalls: Infinity,
      storageGB: 100,
      collections: Infinity,
      exports: Infinity
    }
  };
  
  return limits[tier as keyof typeof limits] || limits.free;
}

function convertToCSV(data: any): string {
  // CSV conversion implementation
  return '';
}

export const User = model<IUser>('User', UserSchema);
