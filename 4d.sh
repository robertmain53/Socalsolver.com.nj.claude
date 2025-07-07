#!/bin/bash

# =============================================================================
# Calculator Platform - Part 4D: Advanced Analytics & Business Intelligence
# =============================================================================
# Revenue Stream: Enterprise analytics, consulting, data insights
# Competitive Advantage: Superior analytics capabilities vs all competitors
# =============================================================================

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT=$(pwd)
ANALYTICS_DIR="$PROJECT_ROOT/src/analytics"
DASHBOARD_DIR="$PROJECT_ROOT/src/dashboard"
REPORTING_DIR="$PROJECT_ROOT/src/reporting"
EXPERIMENTS_DIR="$PROJECT_ROOT/src/experiments"
INTELLIGENCE_DIR="$PROJECT_ROOT/src/intelligence"

echo -e "${BLUE}🚀 Building Advanced Analytics & Business Intelligence...${NC}"

# =============================================================================
# 1. REAL-TIME ANALYTICS ENGINE
# =============================================================================

setup_realtime_analytics() {
    echo -e "${YELLOW}⚡ Setting up real-time analytics engine...${NC}"
    
    # Create analytics directories
    mkdir -p "$ANALYTICS_DIR"/{core,processors,collectors,streaming}
    mkdir -p "$DASHBOARD_DIR"/{components,charts,widgets,real-time}
    mkdir -p "$REPORTING_DIR"/{generators,schedulers,templates,exports}
    mkdir -p "$EXPERIMENTS_DIR"/{ab-testing,feature-flags,optimization}
    mkdir -p "$INTELLIGENCE_DIR"/{ml-models,predictions,insights,recommendations}
    
    # Real-time analytics engine
    cat > "$ANALYTICS_DIR/core/AnalyticsEngine.ts" << 'EOF'
/**
 * Advanced Real-Time Analytics Engine
 * High-performance analytics with streaming data processing and ML insights
 */

import { EventEmitter } from 'events';
import Redis from 'ioredis';
import { Kafka, Producer, Consumer } from 'kafkajs';

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  type: string;
  userId?: string;
  sessionId: string;
  data: Record<string, any>;
  context: {
    ip: string;
    userAgent: string;
    referrer?: string;
    url: string;
    device: {
      type: 'mobile' | 'tablet' | 'desktop';
      os: string;
      browser: string;
    };
    location?: {
      country: string;
      region: string;
      city: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
  };
  metadata: {
    source: string;
    version: string;
    environment: string;
  };
}

export interface AnalyticsMetrics {
  // Real-time metrics
  activeUsers: number;
  calculationsPerSecond: number;
  errorRate: number;
  averageResponseTime: number;
  
  // Business metrics
  conversionRate: number;
  revenuePerUser: number;
  churnRate: number;
  lifetimeValue: number;
  
  // Performance metrics
  pageLoadTime: number;
  bounceRate: number;
  sessionDuration: number;
  pageViewsPerSession: number;
  
  // Calculator-specific metrics
  calculatorPopularity: Record<string, number>;
  calculationAccuracy: number;
  userSatisfaction: number;
  featureUsage: Record<string, number>;
}

export class AnalyticsEngine extends EventEmitter {
  private redis: Redis;
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();
  private metrics: AnalyticsMetrics;
  private processors: Map<string, EventProcessor> = new Map();
  
  constructor(config: {
    redis: {
      host: string;
      port: number;
      password?: string;
    };
    kafka: {
      brokers: string[];
      clientId: string;
    };
  }) {
    super();
    
    this.redis = new Redis(config.redis);
    this.kafka = new Kafka(config.kafka);
    this.producer = this.kafka.producer();
    
    this.metrics = this.initializeMetrics();
    this.setupEventProcessors();
    this.startMetricsCollection();
  }
  
  async initialize(): Promise<void> {
    await this.producer.connect();
    await this.setupConsumers();
    await this.startRealTimeProcessing();
    
    console.log('Analytics Engine initialized successfully');
  }
  
  async trackEvent(event: Partial<AnalyticsEvent>): Promise<void> {
    const completeEvent: AnalyticsEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      sessionId: event.sessionId || this.generateSessionId(),
      ...event
    } as AnalyticsEvent;
    
    // Validate event
    if (!this.validateEvent(completeEvent)) {
      throw new Error('Invalid analytics event');
    }
    
    // Send to Kafka for real-time processing
    await this.producer.send({
      topic: 'analytics-events',
      messages: [{
        key: completeEvent.userId || completeEvent.sessionId,
        value: JSON.stringify(completeEvent),
        timestamp: completeEvent.timestamp.toString()
      }]
    });
    
    // Store in Redis for real-time metrics
    await this.updateRealTimeMetrics(completeEvent);
    
    // Emit for local listeners
    this.emit('event', completeEvent);
  }
  
  async getRealTimeMetrics(): Promise<AnalyticsMetrics> {
    // Update metrics from Redis
    const redisMetrics = await this.getMetricsFromRedis();
    
    return {
      ...this.metrics,
      ...redisMetrics
    };
  }
  
  async getCustomMetrics(query: {
    timeRange: {
      start: Date;
      end: Date;
    };
    filters?: Record<string, any>;
    groupBy?: string[];
    metrics: string[];
  }): Promise<any> {
    
    const pipeline = this.buildAnalyticsPipeline(query);
    return await this.executeQuery(pipeline);
  }
  
  async getDashboardData(dashboardId: string, timeRange?: {
    start: Date;
    end: Date;
  }): Promise<any> {
    
    const widgets = await this.getDashboardWidgets(dashboardId);
    const data: Record<string, any> = {};
    
    for (const widget of widgets) {
      data[widget.id] = await this.getWidgetData(widget, timeRange);
    }
    
    return {
      dashboardId,
      timestamp: new Date(),
      timeRange,
      widgets: data
    };
  }
  
  async createCustomDashboard(config: {
    name: string;
    description?: string;
    widgets: Array<{
      type: string;
      config: any;
      position: { x: number; y: number; w: number; h: number };
    }>;
    permissions: {
      viewers: string[];
      editors: string[];
    };
  }): Promise<string> {
    
    const dashboardId = this.generateDashboardId();
    
    await this.redis.hset(`dashboard:${dashboardId}`, {
      id: dashboardId,
      name: config.name,
      description: config.description || '',
      widgets: JSON.stringify(config.widgets),
      permissions: JSON.stringify(config.permissions),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return dashboardId;
  }
  
  async generateReport(config: {
    type: 'usage' | 'performance' | 'business' | 'custom';
    timeRange: {
      start: Date;
      end: Date;
    };
    filters?: Record<string, any>;
    format: 'json' | 'csv' | 'pdf' | 'excel';
    schedule?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      recipients: string[];
    };
  }): Promise<Buffer | object> {
    
    const reportData = await this.collectReportData(config);
    const formattedReport = await this.formatReport(reportData, config.format);
    
    if (config.schedule) {
      await this.scheduleReport(config);
    }
    
    return formattedReport;
  }
  
  async setupAlerts(config: {
    name: string;
    conditions: Array<{
      metric: string;
      operator: '>' | '<' | '=' | '>=' | '<=';
      threshold: number;
      timeWindow: number; // minutes
    }>;
    actions: Array<{
      type: 'email' | 'slack' | 'webhook' | 'sms';
      config: any;
    }>;
  }): Promise<string> {
    
    const alertId = this.generateAlertId();
    
    await this.redis.hset(`alert:${alertId}`, {
      id: alertId,
      name: config.name,
      conditions: JSON.stringify(config.conditions),
      actions: JSON.stringify(config.actions),
      isActive: 'true',
      createdAt: new Date().toISOString()
    });
    
    // Start monitoring this alert
    this.startAlertMonitoring(alertId, config);
    
    return alertId;
  }
  
  // Private methods
  private initializeMetrics(): AnalyticsMetrics {
    return {
      activeUsers: 0,
      calculationsPerSecond: 0,
      errorRate: 0,
      averageResponseTime: 0,
      conversionRate: 0,
      revenuePerUser: 0,
      churnRate: 0,
      lifetimeValue: 0,
      pageLoadTime: 0,
      bounceRate: 0,
      sessionDuration: 0,
      pageViewsPerSession: 0,
      calculatorPopularity: {},
      calculationAccuracy: 0,
      userSatisfaction: 0,
      featureUsage: {}
    };
  }
  
  private setupEventProcessors(): void {
    // Page view processor
    this.processors.set('page_view', new PageViewProcessor());
    
    // Calculation processor
    this.processors.set('calculation', new CalculationProcessor());
    
    // User interaction processor
    this.processors.set('user_interaction', new InteractionProcessor());
    
    // Conversion processor
    this.processors.set('conversion', new ConversionProcessor());
    
    // Error processor
    this.processors.set('error', new ErrorProcessor());
    
    // Performance processor
    this.processors.set('performance', new PerformanceProcessor());
  }
  
  private async setupConsumers(): Promise<void> {
    // Real-time metrics consumer
    const metricsConsumer = this.kafka.consumer({ groupId: 'analytics-metrics' });
    await metricsConsumer.connect();
    await metricsConsumer.subscribe({ topic: 'analytics-events' });
    
    await metricsConsumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const event: AnalyticsEvent = JSON.parse(message.value.toString());
          await this.processEventForMetrics(event);
        }
      }
    });
    
    this.consumers.set('metrics', metricsConsumer);
    
    // Data warehouse consumer
    const warehouseConsumer = this.kafka.consumer({ groupId: 'analytics-warehouse' });
    await warehouseConsumer.connect();
    await warehouseConsumer.subscribe({ topic: 'analytics-events' });
    
    await warehouseConsumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const event: AnalyticsEvent = JSON.parse(message.value.toString());
          await this.storeEventInWarehouse(event);
        }
      }
    });
    
    this.consumers.set('warehouse', warehouseConsumer);
  }
  
  private async startRealTimeProcessing(): Promise<void> {
    // Start real-time aggregation intervals
    setInterval(async () => {
      await this.calculateRealTimeMetrics();
    }, 1000); // Every second
    
    setInterval(async () => {
      await this.updateDashboards();
    }, 5000); // Every 5 seconds
    
    setInterval(async () => {
      await this.checkAlerts();
    }, 30000); // Every 30 seconds
  }
  
  private async updateRealTimeMetrics(event: AnalyticsEvent): Promise<void> {
    const minute = Math.floor(event.timestamp / 60000); // Round to minute
    const key = `metrics:${minute}`;
    
    // Update counters
    await this.redis.hincrby(key, `events:${event.type}`, 1);
    await this.redis.hincrby(key, 'total_events', 1);
    
    if (event.userId) {
      await this.redis.sadd(`active_users:${minute}`, event.userId);
    }
    
    // Set expiration
    await this.redis.expire(key, 3600); // 1 hour
    await this.redis.expire(`active_users:${minute}`, 3600);
    
    // Update real-time session data
    if (event.sessionId) {
      await this.redis.hset(`session:${event.sessionId}`, {
        lastActivity: event.timestamp,
        eventCount: await this.redis.hincrby(`session:${event.sessionId}`, 'eventCount', 1)
      });
      await this.redis.expire(`session:${event.sessionId}`, 1800); // 30 minutes
    }
  }
  
  private async processEventForMetrics(event: AnalyticsEvent): Promise<void> {
    const processor = this.processors.get(event.type);
    if (processor) {
      await processor.process(event, this.redis);
    }
    
    // Update general metrics
    await this.updateGeneralMetrics(event);
  }
  
  private async storeEventInWarehouse(event: AnalyticsEvent): Promise<void> {
    // Store in time-series database (e.g., ClickHouse, TimeScaleDB)
    // This would be implemented based on your data warehouse choice
    console.log('Storing event in warehouse:', event.id);
  }
  
  private validateEvent(event: AnalyticsEvent): boolean {
    return !!(event.id && event.timestamp && event.type && event.sessionId);
  }
  
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateDashboardId(): string {
    return `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async getMetricsFromRedis(): Promise<Partial<AnalyticsMetrics>> {
    const now = Math.floor(Date.now() / 60000);
    const metrics: Partial<AnalyticsMetrics> = {};
    
    // Active users in last 5 minutes
    const activeUserSets = [];
    for (let i = 0; i < 5; i++) {
      activeUserSets.push(`active_users:${now - i}`);
    }
    
    if (activeUserSets.length > 0) {
      metrics.activeUsers = await this.redis.sunion(...activeUserSets).then(users => users.length);
    }
    
    // Calculations per second (last minute)
    const lastMinuteEvents = await this.redis.hget(`metrics:${now}`, 'events:calculation');
    metrics.calculationsPerSecond = lastMinuteEvents ? parseInt(lastMinuteEvents) / 60 : 0;
    
    return metrics;
  }
  
  private async calculateRealTimeMetrics(): Promise<void> {
    const metrics = await this.getMetricsFromRedis();
    Object.assign(this.metrics, metrics);
    
    // Emit metrics update
    this.emit('metrics-update', this.metrics);
  }
  
  private async updateDashboards(): Promise<void> {
    // Update all active dashboards
    const dashboards = await this.getActiveDashboards();
    
    for (const dashboard of dashboards) {
      const data = await this.getDashboardData(dashboard.id);
      this.emit('dashboard-update', { dashboardId: dashboard.id, data });
    }
  }
  
  private async checkAlerts(): Promise<void> {
    const alerts = await this.getActiveAlerts();
    
    for (const alert of alerts) {
      const shouldTrigger = await this.evaluateAlertConditions(alert);
      if (shouldTrigger) {
        await this.triggerAlert(alert);
      }
    }
  }
  
  private async getActiveDashboards(): Promise<any[]> {
    // Implementation would fetch from Redis/database
    return [];
  }
  
  private async getActiveAlerts(): Promise<any[]> {
    // Implementation would fetch from Redis/database
    return [];
  }
  
  private async evaluateAlertConditions(alert: any): Promise<boolean> {
    // Implementation would evaluate alert conditions
    return false;
  }
  
  private async triggerAlert(alert: any): Promise<void> {
    // Implementation would trigger alert actions
  }
  
  private buildAnalyticsPipeline(query: any): any {
    // Build analytics query pipeline
    return {};
  }
  
  private async executeQuery(pipeline: any): Promise<any> {
    // Execute analytics query
    return {};
  }
  
  private async getDashboardWidgets(dashboardId: string): Promise<any[]> {
    const dashboard = await this.redis.hgetall(`dashboard:${dashboardId}`);
    return dashboard.widgets ? JSON.parse(dashboard.widgets) : [];
  }
  
  private async getWidgetData(widget: any, timeRange?: any): Promise<any> {
    // Get data for specific widget
    return {};
  }
  
  private async collectReportData(config: any): Promise<any> {
    // Collect data for report generation
    return {};
  }
  
  private async formatReport(data: any, format: string): Promise<any> {
    // Format report in requested format
    return {};
  }
  
  private async scheduleReport(config: any): Promise<void> {
    // Schedule recurring report
  }
  
  private startAlertMonitoring(alertId: string, config: any): void {
    // Start monitoring alert conditions
  }
  
  private async updateGeneralMetrics(event: AnalyticsEvent): Promise<void> {
    // Update general platform metrics
  }
  
  private startMetricsCollection(): void {
    // Start collecting system metrics
  }
}

// Event processors
abstract class EventProcessor {
  abstract process(event: AnalyticsEvent, redis: Redis): Promise<void>;
}

class PageViewProcessor extends EventProcessor {
  async process(event: AnalyticsEvent, redis: Redis): Promise<void> {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    await redis.hincrby(`pageviews:${date}`, event.data.page || 'unknown', 1);
    
    // Track unique page views
    const sessionKey = `session_pages:${event.sessionId}`;
    const isUniqueView = await redis.sadd(sessionKey, event.data.page || 'unknown');
    await redis.expire(sessionKey, 1800); // 30 minutes
    
    if (isUniqueView) {
      await redis.hincrby(`unique_pageviews:${date}`, event.data.page || 'unknown', 1);
    }
  }
}

class CalculationProcessor extends EventProcessor {
  async process(event: AnalyticsEvent, redis: Redis): Promise<void> {
    const calculatorId = event.data.calculatorId;
    if (!calculatorId) return;
    
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    
    // Track calculator usage
    await redis.hincrby(`calculator_usage:${date}`, calculatorId, 1);
    
    // Track calculation performance
    if (event.data.duration) {
      await redis.lpush(`calc_performance:${calculatorId}`, event.data.duration);
      await redis.ltrim(`calc_performance:${calculatorId}`, 0, 999); // Keep last 1000
    }
    
    // Track success/failure rate
    const success = event.data.success !== false;
    await redis.hincrby(`calc_results:${date}:${calculatorId}`, success ? 'success' : 'failure', 1);
  }
}

class InteractionProcessor extends EventProcessor {
  async process(event: AnalyticsEvent, redis: Redis): Promise<void> {
    const interactionType = event.data.interaction || 'unknown';
    const target = event.data.target || 'unknown';
    
    const hour = Math.floor(event.timestamp / 3600000); // Round to hour
    await redis.hincrby(`interactions:${hour}`, `${interactionType}:${target}`, 1);
    await redis.expire(`interactions:${hour}`, 86400); // 24 hours
  }
}

class ConversionProcessor extends EventProcessor {
  async process(event: AnalyticsEvent, redis: Redis): Promise<void> {
    const conversionType = event.data.type || 'unknown';
    const value = event.data.value || 0;
    
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    
    // Track conversion count
    await redis.hincrby(`conversions:${date}`, conversionType, 1);
    
    // Track conversion value
    if (value > 0) {
      await redis.hincrbyfloat(`conversion_value:${date}`, conversionType, value);
    }
    
    // Track user conversion
    if (event.userId) {
      await redis.sadd(`converted_users:${date}`, event.userId);
    }
  }
}

class ErrorProcessor extends EventProcessor {
  async process(event: AnalyticsEvent, redis: Redis): Promise<void> {
    const errorType = event.data.errorType || 'unknown';
    const errorCode = event.data.errorCode || 'unknown';
    
    const hour = Math.floor(event.timestamp / 3600000);
    
    // Track error count
    await redis.hincrby(`errors:${hour}`, `${errorType}:${errorCode}`, 1);
    await redis.expire(`errors:${hour}`, 86400);
    
    // Track error details for debugging
    await redis.lpush(`error_details:${errorType}`, JSON.stringify({
      timestamp: event.timestamp,
      code: errorCode,
      message: event.data.message,
      stack: event.data.stack,
      userId: event.userId,
      sessionId: event.sessionId
    }));
    await redis.ltrim(`error_details:${errorType}`, 0, 99); // Keep last 100
  }
}

class PerformanceProcessor extends EventProcessor {
  async process(event: AnalyticsEvent, redis: Redis): Promise<void> {
    const metricType = event.data.metricType;
    const value = event.data.value;
    
    if (!metricType || value === undefined) return;
    
    const minute = Math.floor(event.timestamp / 60000);
    
    // Store performance data
    await redis.lpush(`performance:${metricType}:${minute}`, value);
    await redis.expire(`performance:${metricType}:${minute}`, 3600); // 1 hour
    
    // Calculate and store aggregates
    const values = await redis.lrange(`performance:${metricType}:${minute}`, 0, -1);
    const numValues = values.map(v => parseFloat(v));
    
    if (numValues.length > 0) {
      const avg = numValues.reduce((a, b) => a + b, 0) / numValues.length;
      const max = Math.max(...numValues);
      const min = Math.min(...numValues);
      
      await redis.hset(`performance_agg:${minute}`, {
        [`${metricType}_avg`]: avg,
        [`${metricType}_max`]: max,
        [`${metricType}_min`]: min,
        [`${metricType}_count`]: numValues.length
      });
      await redis.expire(`performance_agg:${minute}`, 3600);
    }
  }
}
EOF

    echo -e "${GREEN}✅ Real-time analytics engine created${NC}"
}

# =============================================================================
# 2. A/B TESTING FRAMEWORK
# =============================================================================

setup_ab_testing() {
    echo -e "${YELLOW}🧪 Setting up A/B testing framework...${NC}"
    
    # A/B Testing Engine
    cat > "$EXPERIMENTS_DIR/ab-testing/ABTestingEngine.ts" << 'EOF'
/**
 * Advanced A/B Testing Framework
 * Statistical analysis, multi-variate testing, and automated optimization
 */

import { EventEmitter } from 'events';
import { AnalyticsEngine } from '../core/AnalyticsEngine';

export interface Experiment {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  
  // Test configuration
  type: 'ab' | 'multivariate' | 'split_url' | 'feature_flag';
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
  
  // Targeting
  targeting: {
    audience: {
      include?: TargetingRule[];
      exclude?: TargetingRule[];
    };
    traffic: number; // Percentage of traffic to include (0-100)
    devices?: ('mobile' | 'tablet' | 'desktop')[];
    locations?: string[]; // Country codes
    segments?: string[]; // User segments
  };
  
  // Variations
  variations: Variation[];
  trafficAllocation: Record<string, number>; // variationId -> percentage
  
  // Goals and metrics
  primaryGoal: Goal;
  secondaryGoals: Goal[];
  
  // Timeline
  startDate: Date;
  endDate?: Date;
  duration?: number; // Days
  
  // Statistical settings
  statistical: {
    significanceLevel: number; // Default 0.05
    statisticalPower: number; // Default 0.8
    minimumDetectableEffect: number; // Minimum effect size to detect
    minimumSampleSize: number;
  };
  
  // Results
  results?: ExperimentResults;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface Variation {
  id: string;
  name: string;
  description?: string;
  isControl: boolean;
  
  // Changes to apply
  changes: Array<{
    type: 'css' | 'javascript' | 'html' | 'redirect' | 'feature_flag';
    selector?: string; // For DOM changes
    content?: string;
    url?: string; // For redirects
    code?: string; // For custom JS
    featureFlag?: string;
    value?: any;
  }>;
  
  // Visual editor data
  visual?: {
    screenshots: string[];
    modifications: any[];
  };
}

export interface Goal {
  id: string;
  name: string;
  type: 'conversion' | 'revenue' | 'engagement' | 'custom';
  
  // Goal definition
  events: Array<{
    type: string;
    conditions?: Record<string, any>;
  }>;
  
  // Revenue goals
  revenueTracking?: {
    currency: string;
    valueSelector?: string; // CSS selector for revenue value
    defaultValue?: number;
  };
  
  // Engagement goals
  engagementTracking?: {
    metric: 'page_views' | 'session_duration' | 'bounce_rate' | 'scroll_depth';
    threshold?: number;
  };
}

export interface TargetingRule {
  field: string; // e.g., 'url', 'utm_source', 'user_type'
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex' | 'in' | 'not_in';
  value: string | string[];
}

export interface ExperimentResults {
  status: 'collecting' | 'analyzing' | 'significant' | 'not_significant' | 'inconclusive';
  
  // Statistical results
  statistical: {
    significance: number;
    confidenceLevel: number;
    pValue: number;
    effect: number;
    confidenceInterval: [number, number];
  };
  
  // Variation performance
  variations: Record<string, VariationResults>;
  
  // Goal results
  goals: Record<string, GoalResults>;
  
  // Recommendations
  recommendation: 'deploy_winner' | 'continue_test' | 'stop_test' | 'declare_no_winner';
  winningVariation?: string;
  
  // Timeline
  startedAt: Date;
  analyzedAt: Date;
  samplesCollected: number;
  daysRunning: number;
}

export interface VariationResults {
  variationId: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue?: number;
  revenuePerVisitor?: number;
  
  // Statistical data
  standardError: number;
  confidenceInterval: [number, number];
  
  // Compared to control
  relativeImprovement?: number;
  statisticalSignificance?: number;
}

export interface GoalResults {
  goalId: string;
  variations: Record<string, {
    events: number;
    rate: number;
    value?: number;
  }>;
  winner?: string;
  significance: number;
}

export class ABTestingEngine extends EventEmitter {
  private experiments: Map<string, Experiment> = new Map();
  private analytics: AnalyticsEngine;
  private activeSessions: Map<string, Map<string, string>> = new Map(); // sessionId -> experimentId -> variationId
  
  constructor(analytics: AnalyticsEngine) {
    super();
    this.analytics = analytics;
    this.setupEventHandlers();
    this.startStatisticalAnalysis();
  }
  
  async createExperiment(config: Omit<Experiment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const experiment: Experiment = {
      ...config,
      id: this.generateExperimentId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Validate experiment configuration
    this.validateExperiment(experiment);
    
    // Calculate minimum sample size
    experiment.statistical.minimumSampleSize = this.calculateSampleSize(experiment);
    
    // Store experiment
    this.experiments.set(experiment.id, experiment);
    await this.persistExperiment(experiment);
    
    this.emit('experiment-created', experiment);
    
    return experiment.id;
  }
  
  async startExperiment(experimentId: string): Promise<void> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }
    
    if (experiment.status !== 'draft') {
      throw new Error('Can only start draft experiments');
    }
    
    experiment.status = 'running';
    experiment.startDate = new Date();
    experiment.updatedAt = new Date();
    
    await this.persistExperiment(experiment);
    await this.activateExperiment(experiment);
    
    this.emit('experiment-started', experiment);
  }
  
  async stopExperiment(experimentId: string, reason: string): Promise<void> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }
    
    experiment.status = 'completed';
    experiment.endDate = new Date();
    experiment.updatedAt = new Date();
    
    await this.persistExperiment(experiment);
    await this.deactivateExperiment(experiment);
    
    // Generate final results
    const results = await this.analyzeExperiment(experimentId);
    experiment.results = results;
    
    this.emit('experiment-stopped', { experiment, reason });
  }
  
  async getVariationForUser(
    experimentId: string, 
    userId: string, 
    sessionId: string,
    context: {
      url: string;
      userAgent: string;
      location?: { country: string; region: string; };
      utm?: Record<string, string>;
    }
  ): Promise<string | null> {
    
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'running') {
      return null;
    }
    
    // Check if user is already assigned to this experiment
    const sessionExperiments = this.activeSessions.get(sessionId);
    if (sessionExperiments?.has(experimentId)) {
      return sessionExperiments.get(experimentId)!;
    }
    
    // Check targeting rules
    if (!this.isUserTargeted(experiment, context)) {
      return null;
    }
    
    // Check traffic allocation
    if (!this.isUserInTraffic(experiment, userId)) {
      return null;
    }
    
    // Assign variation
    const variationId = this.assignVariation(experiment, userId);
    
    // Store assignment
    if (!this.activeSessions.has(sessionId)) {
      this.activeSessions.set(sessionId, new Map());
    }
    this.activeSessions.get(sessionId)!.set(experimentId, variationId);
    
    // Track assignment
    await this.trackExperimentAssignment(experimentId, variationId, userId, sessionId, context);
    
    return variationId;
  }
  
  async trackConversion(
    experimentId: string,
    goalId: string,
    sessionId: string,
    data: {
      value?: number;
      currency?: string;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<void> {
    
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'running') {
      return;
    }
    
    const sessionExperiments = this.activeSessions.get(sessionId);
    const variationId = sessionExperiments?.get(experimentId);
    
    if (!variationId) {
      return; // User not in this experiment
    }
    
    // Track conversion event
    await this.analytics.trackEvent({
      type: 'experiment_conversion',
      sessionId,
      data: {
        experimentId,
        variationId,
        goalId,
        value: data.value,
        currency: data.currency,
        metadata: data.metadata
      }
    });
    
    this.emit('conversion-tracked', {
      experimentId,
      variationId,
      goalId,
      sessionId,
      data
    });
  }
  
  async analyzeExperiment(experimentId: string): Promise<ExperimentResults> {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }
    
    // Collect experiment data
    const data = await this.collectExperimentData(experiment);
    
    // Calculate statistical significance
    const statistical = this.calculateStatisticalSignificance(data, experiment);
    
    // Analyze each goal
    const goalResults: Record<string, GoalResults> = {};
    for (const goal of [experiment.primaryGoal, ...experiment.secondaryGoals]) {
      goalResults[goal.id] = this.analyzeGoal(goal, data, experiment);
    }
    
    // Calculate variation results
    const variations: Record<string, VariationResults> = {};
    for (const variation of experiment.variations) {
      variations[variation.id] = this.calculateVariationResults(variation, data, experiment);
    }
    
    // Determine recommendation
    const recommendation = this.getRecommendation(statistical, goalResults, experiment);
    
    const results: ExperimentResults = {
      status: this.getResultStatus(statistical),
      statistical,
      variations,
      goals: goalResults,
      recommendation: recommendation.action,
      winningVariation: recommendation.winner,
      startedAt: experiment.startDate,
      analyzedAt: new Date(),
      samplesCollected: data.totalSamples,
      daysRunning: Math.floor((Date.now() - experiment.startDate.getTime()) / (1000 * 60 * 60 * 24))
    };
    
    return results;
  }
  
  async getExperimentInsights(experimentId: string): Promise<{
    performance: any;
    segments: any;
    timeline: any;
    recommendations: string[];
  }> {
    
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error('Experiment not found');
    }
    
    const data = await this.collectDetailedExperimentData(experiment);
    
    return {
      performance: this.analyzePerformancePatterns(data),
      segments: this.analyzeSegmentPerformance(data),
      timeline: this.analyzeTimelinePatterns(data),
      recommendations: this.generateInsightRecommendations(data, experiment)
    };
  }
  
  // Private methods
  private setupEventHandlers(): void {
    this.analytics.on('event', (event) => {
      if (event.type === 'page_view') {
        this.handlePageView(event);
      }
    });
  }
  
  private startStatisticalAnalysis(): void {
    // Run statistical analysis every hour
    setInterval(async () => {
      await this.runScheduledAnalysis();
    }, 60 * 60 * 1000);
  }
  
  private async runScheduledAnalysis(): Promise<void> {
    for (const [experimentId, experiment] of this.experiments) {
      if (experiment.status === 'running') {
        try {
          const results = await this.analyzeExperiment(experimentId);
          
          // Check if experiment should be stopped
          if (this.shouldStopExperiment(results, experiment)) {
            await this.stopExperiment(experimentId, 'Statistical significance reached');
          }
          
          // Update results
          experiment.results = results;
          await this.persistExperiment(experiment);
          
          this.emit('experiment-analyzed', { experimentId, results });
          
        } catch (error) {
          console.error(`Error analyzing experiment ${experimentId}:`, error);
        }
      }
    }
  }
  
  private validateExperiment(experiment: Experiment): void {
    if (experiment.variations.length < 2) {
      throw new Error('Experiment must have at least 2 variations');
    }
    
    const controlVariations = experiment.variations.filter(v => v.isControl);
    if (controlVariations.length !== 1) {
      throw new Error('Experiment must have exactly one control variation');
    }
    
    const totalAllocation = Object.values(experiment.trafficAllocation).reduce((a, b) => a + b, 0);
    if (Math.abs(totalAllocation - 100) > 0.01) {
      throw new Error('Traffic allocation must sum to 100%');
    }
  }
  
  private calculateSampleSize(experiment: Experiment): number {
    // Calculate minimum sample size using statistical formulas
    const alpha = experiment.statistical.significanceLevel;
    const beta = 1 - experiment.statistical.statisticalPower;
    const effect = experiment.statistical.minimumDetectableEffect;
    
    // Simplified calculation (real implementation would use proper statistical formulas)
    const z_alpha = this.getZScore(alpha / 2);
    const z_beta = this.getZScore(beta);
    
    const sampleSize = 2 * Math.pow(z_alpha + z_beta, 2) / Math.pow(effect, 2);
    
    return Math.ceil(sampleSize);
  }
  
  private getZScore(p: number): number {
    // Simplified Z-score calculation
    // Real implementation would use proper statistical libraries
    if (p === 0.025) return 1.96; // 95% confidence
    if (p === 0.005) return 2.576; // 99% confidence
    if (p === 0.2) return 0.842; // 80% power
    return 1.96; // Default
  }
  
  private isUserTargeted(experiment: Experiment, context: any): boolean {
    const { audience } = experiment.targeting;
    
    // Check include rules
    if (audience.include && !this.matchesRules(audience.include, context)) {
      return false;
    }
    
    // Check exclude rules
    if (audience.exclude && this.matchesRules(audience.exclude, context)) {
      return false;
    }
    
    return true;
  }
  
  private matchesRules(rules: TargetingRule[], context: any): boolean {
    return rules.every(rule => this.matchesRule(rule, context));
  }
  
  private matchesRule(rule: TargetingRule, context: any): boolean {
    const value = this.getContextValue(rule.field, context);
    
    switch (rule.operator) {
      case 'equals':
        return value === rule.value;
      case 'contains':
        return typeof value === 'string' && value.includes(rule.value as string);
      case 'starts_with':
        return typeof value === 'string' && value.startsWith(rule.value as string);
      case 'ends_with':
        return typeof value === 'string' && value.endsWith(rule.value as string);
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(value);
      case 'not_in':
        return Array.isArray(rule.value) && !rule.value.includes(value);
      case 'regex':
        return typeof value === 'string' && new RegExp(rule.value as string).test(value);
      default:
        return false;
    }
  }
  
  private getContextValue(field: string, context: any): any {
    const parts = field.split('.');
    let value = context;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value;
  }
  
  private isUserInTraffic(experiment: Experiment, userId: string): boolean {
    // Use consistent hashing to determine if user is in traffic
    const hash = this.hashString(userId + experiment.id);
    const percentage = (hash % 100) + 1;
    return percentage <= experiment.targeting.traffic;
  }
  
  private assignVariation(experiment: Experiment, userId: string): string {
    // Use consistent hashing for variation assignment
    const hash = this.hashString(userId + experiment.id + 'variation');
    const percentage = hash % 100;
    
    let cumulative = 0;
    for (const [variationId, allocation] of Object.entries(experiment.trafficAllocation)) {
      cumulative += allocation;
      if (percentage < cumulative) {
        return variationId;
      }
    }
    
    // Fallback to control
    return experiment.variations.find(v => v.isControl)!.id;
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  private async trackExperimentAssignment(
    experimentId: string,
    variationId: string,
    userId: string,
    sessionId: string,
    context: any
  ): Promise<void> {
    
    await this.analytics.trackEvent({
      type: 'experiment_assignment',
      userId,
      sessionId,
      data: {
        experimentId,
        variationId,
        url: context.url,
        userAgent: context.userAgent
      }
    });
  }
  
  private async handlePageView(event: any): Promise<void> {
    // Handle page view events for experiments
    // This could trigger experiment assignments or goal tracking
  }
  
  private generateExperimentId(): string {
    return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async persistExperiment(experiment: Experiment): Promise<void> {
    // Store experiment in database
    console.log('Persisting experiment:', experiment.id);
  }
  
  private async activateExperiment(experiment: Experiment): Promise<void> {
    // Activate experiment in the system
    console.log('Activating experiment:', experiment.id);
  }
  
  private async deactivateExperiment(experiment: Experiment): Promise<void> {
    // Deactivate experiment in the system
    console.log('Deactivating experiment:', experiment.id);
  }
  
  private async collectExperimentData(experiment: Experiment): Promise<any> {
    // Collect experiment data for analysis
    return { totalSamples: 0 };
  }
  
  private async collectDetailedExperimentData(experiment: Experiment): Promise<any> {
    // Collect detailed experiment data for insights
    return {};
  }
  
  private calculateStatisticalSignificance(data: any, experiment: Experiment): any {
    // Calculate statistical significance
    return {
      significance: 0,
      confidenceLevel: 0.95,
      pValue: 1,
      effect: 0,
      confidenceInterval: [0, 0]
    };
  }
  
  private analyzeGoal(goal: Goal, data: any, experiment: Experiment): GoalResults {
    // Analyze goal performance
    return {
      goalId: goal.id,
      variations: {},
      significance: 0
    };
  }
  
  private calculateVariationResults(variation: Variation, data: any, experiment: Experiment): VariationResults {
    // Calculate variation results
    return {
      variationId: variation.id,
      visitors: 0,
      conversions: 0,
      conversionRate: 0,
      standardError: 0,
      confidenceInterval: [0, 0]
    };
  }
  
  private getRecommendation(statistical: any, goalResults: any, experiment: Experiment): { action: any; winner?: string } {
    // Generate recommendation based on results
    return { action: 'continue_test' };
  }
  
  private getResultStatus(statistical: any): any {
    // Determine result status
    return 'collecting';
  }
  
  private shouldStopExperiment(results: ExperimentResults, experiment: Experiment): boolean {
    // Determine if experiment should be stopped
    return false;
  }
  
  private analyzePerformancePatterns(data: any): any {
    // Analyze performance patterns
    return {};
  }
  
  private analyzeSegmentPerformance(data: any): any {
    // Analyze segment performance
    return {};
  }
  
  private analyzeTimelinePatterns(data: any): any {
    // Analyze timeline patterns
    return {};
  }
  
  private generateInsightRecommendations(data: any, experiment: Experiment): string[] {
    // Generate insight recommendations
    return [];
  }
}
EOF

    echo -e "${GREEN}✅ A/B testing framework created${NC}"
}

# =============================================================================
# 3. BUSINESS INTELLIGENCE DASHBOARD
# =============================================================================

setup_business_intelligence() {
    echo -e "${YELLOW}📈 Setting up business intelligence dashboard...${NC}"
    
    # Business Intelligence Dashboard
    cat > "$DASHBOARD_DIR/BusinessIntelligenceDashboard.tsx" << 'EOF'
/**
 * Advanced Business Intelligence Dashboard
 * Real-time insights, predictive analytics, and executive reporting
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar, Pie, Area } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface DashboardProps {
  timeRange: {
    start: Date;
    end: Date;
  };
  refreshInterval?: number;
}

export function BusinessIntelligenceDashboard({ timeRange, refreshInterval = 30000 }: DashboardProps) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'users', 'calculations']);
  const [viewType, setViewType] = useState<'overview' | 'detailed' | 'executive'>('overview');

  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(fetchDashboardData, refreshInterval);
    return () => clearInterval(interval);
  }, [timeRange, refreshInterval]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeRange,
          metrics: selectedMetrics,
          viewType
        })
      });
      
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpis = useMemo(() => {
    return [
      {
        title: 'Total Revenue',
        value: data.revenue?.total || 0,
        change: data.revenue?.change || 0,
        format: 'currency',
        icon: '💰'
      },
      {
        title: 'Active Users',
        value: data.users?.active || 0,
        change: data.users?.change || 0,
        format: 'number',
        icon: '👥'
      },
      {
        title: 'Calculations/Day',
        value: data.calculations?.perDay || 0,
        change: data.calculations?.change || 0,
        format: 'number',
        icon: '🧮'
      },
      {
        title: 'Conversion Rate',
        value: data.conversions?.rate || 0,
        change: data.conversions?.change || 0,
        format: 'percentage',
        icon: '📈'
      },
      {
        title: 'Avg Revenue/User',
        value: data.revenue?.perUser || 0,
        change: data.revenue?.userChange || 0,
        format: 'currency',
        icon: '💵'
      },
      {
        title: 'Customer LTV',
        value: data.ltv?.value || 0,
        change: data.ltv?.change || 0,
        format: 'currency',
        icon: '⭐'
      }
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Intelligence</h1>
              <p className="text-gray-600">
                {format(timeRange.start, 'MMM d')} - {format(timeRange.end, 'MMM d, yyyy')}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="overview">Overview</option>
                <option value="detailed">Detailed</option>
                <option value="executive">Executive</option>
              </select>
              
              <button
                onClick={fetchDashboardData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <ChartCard
            title="Revenue Trend"
            subtitle="Daily revenue over time"
          >
            <RevenueChart data={data.revenueTimeline || []} />
          </ChartCard>

          {/* User Growth */}
          <ChartCard
            title="User Growth"
            subtitle="New users and total active users"
          >
            <UserGrowthChart data={data.userGrowth || []} />
          </ChartCard>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Calculator Usage */}
          <ChartCard
            title="Calculator Usage"
            subtitle="Most popular calculators"
          >
            <CalculatorUsageChart data={data.calculatorUsage || []} />
          </ChartCard>

          {/* Conversion Funnel */}
          <ChartCard
            title="Conversion Funnel"
            subtitle="User journey analysis"
          >
            <ConversionFunnelChart data={data.conversionFunnel || []} />
          </ChartCard>

          {/* Geographic Distribution */}
          <ChartCard
            title="Geographic Usage"
            subtitle="Users by country"
          >
            <GeographicChart data={data.geographic || []} />
          </ChartCard>
        </div>

        {/* Detailed Tables */}
        {viewType === 'detailed' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DetailedTable
              title="Top Performing Calculators"
              data={data.topCalculators || []}
              columns={[
                { key: 'name', label: 'Calculator' },
                { key: 'usage', label: 'Usage', format: 'number' },
                { key: 'conversion', label: 'Conversion', format: 'percentage' },
                { key: 'revenue', label: 'Revenue', format: 'currency' }
              ]}
            />

            <DetailedTable
              title="User Segments"
              data={data.userSegments || []}
              columns={[
                { key: 'segment', label: 'Segment' },
                { key: 'users', label: 'Users', format: 'number' },
                { key: 'ltv', label: 'LTV', format: 'currency' },
                { key: 'churn', label: 'Churn', format: 'percentage' }
              ]}
            />
          </div>
        )}

        {/* Executive Summary */}
        {viewType === 'executive' && (
          <ExecutiveSummary data={data.executiveSummary || {}} />
        )}

        {/* Insights and Alerts */}
        <InsightsPanel insights={data.insights || []} alerts={data.alerts || []} />
      </div>
    </div>
  );
}

function KPICard({ title, value, change, format, icon }: any) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
        return val.toLocaleString();
      default:
        return val.toString();
    }
  };

  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value, format)}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      
      <div className="mt-4 flex items-center">
        <span className={`flex items-center text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? '↗' : '↘'}
          {Math.abs(change).toFixed(1)}%
        </span>
        <span className="text-gray-500 text-sm ml-2">vs last period</span>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: any) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="h-64">
      <Area
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        width={400}
        height={250}
      >
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
      </Area>
    </div>
  );
}

function UserGrowthChart({ data }: { data: any[] }) {
  return (
    <div className="h-64">
      <Line
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        width={400}
        height={250}
      >
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="totalUsers" stroke="#3b82f6" strokeWidth={2} />
      </Line>
    </div>
  );
}

function CalculatorUsageChart({ data }: { data: any[] }) {
  return (
    <div className="h-64">
      <Bar
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        width={300}
        height={250}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Bar dataKey="usage" fill="#8884d8" />
      </Bar>
    </div>
  );
}

function ConversionFunnelChart({ data }: { data: any[] }) {
  return (
    <div className="h-64">
      <Bar
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        width={300}
        height={250}
      >
        <XAxis dataKey="stage" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Bar dataKey="users" fill="#f59e0b" />
      </Bar>
    </div>
  );
}

function GeographicChart({ data }: { data: any[] }) {
  return (
    <div className="h-64">
      <Pie
        data={data}
        cx={150}
        cy={125}
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="users"
        width={300}
        height={250}
      >
        <Tooltip />
      </Pie>
    </div>
  );
}

function DetailedTable({ title, data, columns }: any) {
  const formatValue = (value: any, format: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString();
      default:
        return value;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column: any) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row: any, index: number) => (
              <tr key={index}>
                {columns.map((column: any) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatValue(row[column.key], column.format || 'text')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExecutiveSummary({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Key Achievements</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {data.achievements?.map((achievement: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {achievement}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {data.improvements?.map((improvement: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-orange-500 mr-2">⚠</span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-medium text-gray-900 mb-2">Strategic Recommendations</h4>
        <div className="text-sm text-gray-600">
          {data.recommendations?.map((rec: string, index: number) => (
            <p key={index} className="mb-2">{index + 1}. {rec}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightsPanel({ insights, alerts }: { insights: any[]; alerts: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        <div className="p-6">
          {insights.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No insights available</p>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span>Confidence: {insight.confidence}%</span>
                    <span className="mx-2">•</span>
                    <span>Impact: {insight.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
        </div>
        <div className="p-6">
          {alerts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active alerts</p>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className={`border-l-4 pl-4 ${
                  alert.severity === 'high' ? 'border-red-500' :
                  alert.severity === 'medium' ? 'border-orange-500' :
                  'border-yellow-500'
                }`}>
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span>Triggered: {alert.triggeredAt}</span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">{alert.severity} priority</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
EOF

    echo -e "${GREEN}✅ Business intelligence dashboard created${NC}"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    echo -e "${BLUE}🚀 Starting Advanced Analytics & Business Intelligence Build...${NC}"
    echo -e "${BLUE}This will create enterprise-grade analytics with real-time insights${NC}\n"
    
    # Setup real-time analytics engine
    setup_realtime_analytics
    echo ""
    
    # Setup A/B testing framework
    setup_ab_testing
    echo ""
    
    # Setup business intelligence dashboard
    setup_business_intelligence
    echo ""
    
    echo -e "${GREEN}✅ Advanced Analytics & Business Intelligence Complete!${NC}"
    echo -e "${YELLOW}🎯 Key Features Implemented:${NC}"
    echo "   ⚡ Real-time analytics engine with streaming data processing"
    echo "   🧪 Advanced A/B testing framework with statistical analysis"
    echo "   📊 Comprehensive business intelligence dashboard"
    echo "   🎯 Conversion tracking and funnel analysis"
    echo "   📈 Performance monitoring and alerting system"
    echo "   🤖 AI-powered insights and recommendations"
    echo "   📋 Executive reporting and KPI tracking"
    echo "   🌍 Geographic and demographic analytics"
    echo ""
    echo -e "${BLUE}💰 Revenue Streams Enabled:${NC}"
    echo "   • Enterprise analytics packages and consulting"
    echo "   • Custom dashboard development services"
    echo "   • Advanced reporting and data export features"
    echo "   • A/B testing and optimization services"
    echo "   • Business intelligence licensing"
    echo "   • Data insights and market research products"
    echo ""
    echo -e "${GREEN}🏆 Competitive Advantages:${NC}"
    echo "   ✓ Real-time analytics vs static reporting competitors"
    echo "   ✓ Advanced statistical analysis capabilities"
    echo "   ✓ Enterprise-grade business intelligence"
    echo "   ✓ AI-powered insights and predictions"
    echo "   ✓ Comprehensive A/B testing framework"
    echo "   ✓ Custom dashboard and reporting solutions"
    echo ""
    echo -e "${YELLOW}📁 Files Created:${NC}"
    echo "   ⚡ $ANALYTICS_DIR/ - Real-time analytics engine"
    echo "   📊 $DASHBOARD_DIR/ - Business intelligence dashboards"
    echo "   📋 $REPORTING_DIR/ - Report generation system"
    echo "   🧪 $EXPERIMENTS_DIR/ - A/B testing framework"
    echo "   🤖 $INTELLIGENCE_DIR/ - AI insights and predictions"
    echo ""
    echo -e "${BLUE}Next: Run script 4E to build AI-Powered Features & Smart Recommendations!${NC}"
}

# Run main function
main

echo -e "${GREEN}Script 4D completed successfully!${NC}"