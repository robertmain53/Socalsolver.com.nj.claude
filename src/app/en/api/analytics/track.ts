/**
 * Analytics Tracking API
 * Receives and processes widget analytics events
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';

interface TrackingRequest {
 events: Array<{
 event: string;
 timestamp: number;
 widgetId: string;
 calculatorId: string;
 data?: any;
 user?: any;
 page?: any;
 device?: any;
 }>;
}

export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 if (req.method !== 'POST') {
 return res.status(405).json({ error: 'Method not allowed' });
 }
 
 try {
 const { events }: TrackingRequest = req.body;
 
 if (!Array.isArray(events) || events.length === 0) {
 return res.status(400).json({ error: 'Invalid events data' });
 }
 
 // Process each event
 const processedEvents = events.map(event => processEvent(event, req));
 
 // Store events in database (implement based on your storage solution)
 await storeEvents(processedEvents);
 
 // Send to external analytics services if configured
 await forwardToExternalServices(processedEvents);
 
 res.status(200).json({ 
 success: true, 
 processed: processedEvents.length 
 });
 
 } catch (error) {
 console.error('Analytics tracking error:', error);
 res.status(500).json({ error: 'Internal server error' });
 }
}

function processEvent(event: any, req: NextApiRequest): any {
 // Add server-side data
 const processed = {
 ...event,
 server: {
 ip: getClientIP(req),
 timestamp: Date.now(),
 userAgent: req.headers['user-agent'],
 country: getCountryFromIP(getClientIP(req))
 },
 // Hash PII for privacy
 user: {
 ...event.user,
 fingerprint: hashPII(event.user?.fingerprint)
 }
 };
 
 // Validate and sanitize data
 return sanitizeEvent(processed);
}

function getClientIP(req: NextApiRequest): string {
 return (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
 (req.headers['x-real-ip'] as string) ||
 req.connection.remoteAddress ||
 'unknown';
}

function getCountryFromIP(ip: string): string {
 // Implement IP geolocation (use service like MaxMind or IP-API)
 return 'unknown';
}

function hashPII(data: string): string {
 if (!data) return 'unknown';
 return createHash('sha256').update(data).digest('hex').substr(0, 16);
}

function sanitizeEvent(event: any): any {
 // Remove or encrypt sensitive data
 const sanitized = { ...event };
 
 // Remove full URLs, keep only domains
 if (sanitized.page?.url) {
 try {
 const url = new URL(sanitized.page.url);
 sanitized.page.domain = url.hostname;
 delete sanitized.page.url;
 } catch (e) {
 delete sanitized.page.url;
 }
 }
 
 // Truncate long strings
 if (sanitized.data) {
 Object.keys(sanitized.data).forEach(key => {
 if (typeof sanitized.data[key] === 'string' && sanitized.data[key].length > 1000) {
 sanitized.data[key] = sanitized.data[key].substr(0, 1000) + '...';
 }
 });
 }
 
 return sanitized;
}

async function storeEvents(events: any[]): Promise<void> {
 // Implement your storage solution
 // Options: PostgreSQL, MongoDB, ClickHouse, BigQuery, etc.
 
 console.log(`Storing ${events.length} analytics events`);
 
 // Example: Store in database
 /*
 const queries = events.map(event => ({
 insertOne: {
 document: {
 ...event,
 _id: generateEventId(event)
 }
 }
 }));
 
 await db.collection('analytics_events').bulkWrite(queries);
 */
}

async function forwardToExternalServices(events: any[]): Promise<void> {
 // Forward to Google Analytics, Mixpanel, Amplitude, etc.
 
 const promises = [];
 
 // Google Analytics 4
 if (process.env.GA4_MEASUREMENT_ID) {
 promises.push(sendToGA4(events));
 }
 
 // Mixpanel
 if (process.env.MIXPANEL_TOKEN) {
 promises.push(sendToMixpanel(events));
 }
 
 // Custom webhooks
 if (process.env.ANALYTICS_WEBHOOKS) {
 const webhooks = process.env.ANALYTICS_WEBHOOKS.split(',');
 webhooks.forEach(webhook => {
 promises.push(sendToWebhook(webhook, events));
 });
 }
 
 await Promise.allSettled(promises);
}

async function sendToGA4(events: any[]): Promise<void> {
 // Implement GA4 Measurement Protocol
 const measurementId = process.env.GA4_MEASUREMENT_ID;
 const apiSecret = process.env.GA4_API_SECRET;
 
 // Convert events to GA4 format and send
}

async function sendToMixpanel(events: any[]): Promise<void> {
 // Implement Mixpanel tracking
 const token = process.env.MIXPANEL_TOKEN;
 
 // Convert events to Mixpanel format and send
}

async function sendToWebhook(url: string, events: any[]): Promise<void> {
 try {
 await fetch(url, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ events })
 });
 } catch (error) {
 console.warn(`Webhook delivery failed: ${url}`, error);
 }
}

function generateEventId(event: any): string {
 const data = `${event.widgetId}_${event.timestamp}_${event.event}`;
 return createHash('md5').update(data).digest('hex');
}
