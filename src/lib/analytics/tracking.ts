import { CalculatorSEO } from '@/lib/seo';

export interface CalculatorEvent {
 event: string;
 calculator_id: string;
 calculator_title: string;
 category: string;
 timestamp: number;
 user_agent?: string;
 session_id?: string;
}

export interface CalculatorUsage {
 calculator_id: string;
 input_values: Record<string, any>;
 results: Record<string, any>;
 calculation_time: number;
 timestamp: number;
}

export class AnalyticsTracker {
 private static sessionId: string | null = null;

 static initializeSession(): void {
 if (typeof window !== 'undefined' && !this.sessionId) {
 this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
 }
 }

 static trackCalculatorView(calculator: CalculatorSEO): void {
 this.initializeSession();
 
 const event: CalculatorEvent = {
 event: 'calculator_view',
 calculator_id: calculator.id,
 calculator_title: calculator.title,
 category: calculator.category,
 timestamp: Date.now(),
 user_agent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
 session_id: this.sessionId || undefined,
 };

 this.sendEvent(event);
 }

 static trackCalculatorUse(
 calculator: CalculatorSEO,
 inputValues: Record<string, any>,
 results: Record<string, any>,
 calculationTime: number
 ): void {
 this.initializeSession();

 // Track usage event
 const usageEvent: CalculatorUsage = {
 calculator_id: calculator.id,
 input_values: inputValues,
 results,
 calculation_time: calculationTime,
 timestamp: Date.now(),
 };

 this.sendUsageEvent(usageEvent);

 // Track as general event
 const event: CalculatorEvent = {
 event: 'calculator_calculate',
 calculator_id: calculator.id,
 calculator_title: calculator.title,
 category: calculator.category,
 timestamp: Date.now(),
 session_id: this.sessionId || undefined,
 };

 this.sendEvent(event);
 }

 static trackSearchQuery(query: string, resultCount: number): void {
 this.initializeSession();

 const event = {
 event: 'search_query',
 search_query: query,
 result_count: resultCount,
 timestamp: Date.now(),
 session_id: this.sessionId || undefined,
 };

 this.sendEvent(event);
 }

 static trackCategoryView(category: string, calculatorCount: number): void {
 this.initializeSession();

 const event = {
 event: 'category_view',
 category,
 calculator_count: calculatorCount,
 timestamp: Date.now(),
 session_id: this.sessionId || undefined,
 };

 this.sendEvent(event);
 }

 private static sendEvent(event: any): void {
 if (typeof window === 'undefined') return;

 // Google Analytics 4
 if (typeof gtag !== 'undefined') {
 gtag('event', event.event, {
 calculator_id: event.calculator_id,
 calculator_title: event.calculator_title,
 category: event.category,
 custom_parameter_1: event.session_id,
 });
 }

 // Custom analytics endpoint
 this.sendToCustomAnalytics(event);

 // Console logging for development
 if (process.env.NODE_ENV === 'development') {
 console.log('Analytics Event:', event);
 }
 }

 private static sendUsageEvent(usage: CalculatorUsage): void {
 if (typeof window === 'undefined') return;

 // Send to custom analytics endpoint
 this.sendToCustomAnalytics({
 event: 'calculator_usage',
 ...usage,
 });
 }

 private static sendToCustomAnalytics(data: any): void {
 // Send to your custom analytics endpoint
 if (typeof window !== 'undefined') {
 fetch('/api/analytics/track', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify(data),
 }).catch((error) => {
 console.warn('Failed to send analytics event:', error);
 });
 }
 }

 static generateDashboardData(): any {
 // This would typically fetch from your analytics backend
 return {
 totalCalculators: 0,
 totalViews: 0,
 totalCalculations: 0,
 popularCalculators: [],
 categoryBreakdown: {},
 searchQueries: [],
 userEngagement: {
 averageSessionDuration: 0,
 bounceRate: 0,
 calculationsPerSession: 0,
 },
 };
 }
}

// Global analytics declaration
declare global {
 function gtag(...args: any[]): void;
}
