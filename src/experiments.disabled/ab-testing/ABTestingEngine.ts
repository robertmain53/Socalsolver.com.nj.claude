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
