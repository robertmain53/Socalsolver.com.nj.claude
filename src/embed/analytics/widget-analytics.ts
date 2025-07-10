/**
 * Widget Analytics System
 * Tracks usage, performance, and conversion metrics
 */

interface AnalyticsEvent {
 event: string;
 timestamp: number;
 widgetId: string;
 calculatorId: string;
 data?: any;
 user?: {
 id?: string;
 session: string;
 fingerprint: string;
 };
 page: {
 url: string;
 title: string;
 referrer: string;
 };
 device: {
 userAgent: string;
 viewport: { width: number; height: number };
 language: string;
 };
}

class WidgetAnalytics {
 private events: AnalyticsEvent[] = [];
 private sessionId: string;
 private fingerprint: string;
 private batchSize = 10;
 private flushInterval = 30000; // 30 seconds
 private endpoint = '/api/analytics/track';
 
 constructor() {
 this.sessionId = this.generateSessionId();
 this.fingerprint = this.generateFingerprint();
 this.startPeriodicFlush();
 }
 
 track(event: string, data: any = {}, widgetId: string, calculatorId: string): void {
 const analyticsEvent: AnalyticsEvent = {
 event,
 timestamp: Date.now(),
 widgetId,
 calculatorId,
 data,
 user: {
 session: this.sessionId,
 fingerprint: this.fingerprint
 },
 page: {
 url: window.location.href,
 title: document.title,
 referrer: document.referrer
 },
 device: {
 userAgent: navigator.userAgent,
 viewport: {
 width: window.innerWidth,
 height: window.innerHeight
 },
 language: navigator.language
 }
 };
 
 this.events.push(analyticsEvent);
 
 // Flush immediately for critical events
 if (this.isCriticalEvent(event)) {
 this.flush();
 } else if (this.events.length >= this.batchSize) {
 this.flush();
 }
 }
 
 private isCriticalEvent(event: string): boolean {
 return ['conversion', 'error', 'widget_load_failed'].includes(event);
 }
 
 private async flush(): Promise<void> {
 if (this.events.length === 0) return;
 
 const eventsToSend = [...this.events];
 this.events = [];
 
 try {
 await fetch(this.endpoint, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'X-Analytics-Version': '2.0'
 },
 body: JSON.stringify({ events: eventsToSend }),
 keepalive: true // Ensures delivery even if page is closing
 });
 
 } catch (error) {
 console.warn('Analytics tracking failed:', error);
 // Re-add events to queue for retry
 this.events.unshift(...eventsToSend);
 }
 }
 
 private startPeriodicFlush(): void {
 setInterval(() => this.flush(), this.flushInterval);
 
 // Flush on page unload
 window.addEventListener('beforeunload', () => this.flush());
 window.addEventListener('pagehide', () => this.flush());
 }
 
 private generateSessionId(): string {
 return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
 }
 
 private generateFingerprint(): string {
 // Create a stable fingerprint for the user
 const canvas = document.createElement('canvas');
 const ctx = canvas.getContext('2d')!;
 ctx.textBaseline = 'top';
 ctx.font = '14px Arial';
 ctx.fillText('Widget fingerprint', 2, 2);
 
 const fingerprint = [
 navigator.userAgent,
 navigator.language,
 screen.width + 'x' + screen.height,
 new Date().getTimezoneOffset(),
 canvas.toDataURL()
 ].join('|');
 
 return btoa(fingerprint).substr(0, 16);
 }
 
 // Performance tracking
 trackPerformance(widgetId: string, calculatorId: string, metrics: any): void {
 this.track('performance', metrics, widgetId, calculatorId);
 }
 
 // Conversion tracking
 trackConversion(widgetId: string, calculatorId: string, value: number, currency = 'USD'): void {
 this.track('conversion', { value, currency }, widgetId, calculatorId);
 }
 
 // Engagement tracking
 trackEngagement(widgetId: string, calculatorId: string, action: string, duration?: number): void {
 this.track('engagement', { action, duration }, widgetId, calculatorId);
 }
 
 // Error tracking
 trackError(widgetId: string, calculatorId: string, error: Error, context?: any): void {
 this.track('error', {
 message: error.message,
 stack: error.stack,
 context
 }, widgetId, calculatorId);
 }
}

// Global analytics instance
const globalAnalytics = new WidgetAnalytics();

// Export for use in widgets
(window as any).WidgetAnalytics = WidgetAnalytics;
(window as any).globalAnalytics = globalAnalytics;
