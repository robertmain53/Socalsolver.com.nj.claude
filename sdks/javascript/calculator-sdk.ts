/**
 * Calculator API SDK for JavaScript/TypeScript
 * Full-featured SDK with TypeScript support, caching, and error handling
 */

export interface CalculatorSDKConfig {
 apiKey: string;
 baseUrl?: string;
 timeout?: number;
 retries?: number;
 cacheEnabled?: boolean;
 debug?: boolean;
}

export interface CalculationInput {
 calculatorId: string;
 inputs: Record<string, any>;
 format?: 'simple' | 'detailed' | 'breakdown';
 precision?: number;
 currency?: string;
 locale?: string;
}

export interface CalculationResult {
 result: any;
 formatted?: any;
 breakdown?: any[];
 metadata: {
 duration: number;
 cached: boolean;
 precision: number;
 currency: string;
 locale: string;
 };
}

export class CalculatorSDK {
 private config: Required<CalculatorSDKConfig>;
 private cache = new Map<string, { data: any; expires: number }>();

 constructor(config: CalculatorSDKConfig) {
 this.config = {
 baseUrl: 'https://api.yourcalculatorsite.com/v2',
 timeout: 30000,
 retries: 3,
 cacheEnabled: true,
 debug: false,
 ...config
 };
 }

 /**
 * Get list of available calculators
 */
 async getCalculators(options: {
 category?: string;
 featured?: boolean;
 search?: string;
 page?: number;
 limit?: number;
 } = {}): Promise<any> {
 const params = new URLSearchParams();
 Object.entries(options).forEach(([key, value]) => {
 if (value !== undefined) {
 params.append(key, value.toString());
 }
 });

 return this.request('GET', `/calculators?${params}`);
 }

 /**
 * Perform a calculation
 */
 async calculate(input: CalculationInput): Promise<CalculationResult> {
 // Generate cache key for calculation
 const cacheKey = this.generateCalculationCacheKey(input);
 
 if (this.config.cacheEnabled) {
 const cached = this.getFromCache(cacheKey);
 if (cached) {
 cached.metadata.cached = true;
 return cached;
 }
 }

 const result = await this.request('POST', '/calculate', input);
 
 if (this.config.cacheEnabled) {
 this.setCache(cacheKey, result, 3600000); // Cache for 1 hour
 }

 return result;
 }

 /**
 * Generic request method with retry logic
 */
 private async request(
 method: string, 
 endpoint: string, 
 data?: any
 ): Promise<any> {
 const url = `${this.config.baseUrl}${endpoint}`;
 let lastError: Error;

 for (let attempt = 0; attempt <= this.config.retries; attempt++) {
 try {
 const controller = new AbortController();
 const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

 const requestOptions: RequestInit = {
 method,
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${this.config.apiKey}`,
 'User-Agent': 'CalculatorSDK/2.0.0'
 },
 signal: controller.signal
 };

 if (data && method !== 'GET') {
 requestOptions.body = JSON.stringify(data);
 }

 if (this.config.debug) {
 console.log(`${method} ${url}`, data);
 }

 const response = await fetch(url, requestOptions);
 clearTimeout(timeoutId);

 if (!response.ok) {
 const error = await response.json().catch(() => ({}));
 throw new Error(`API Error ${response.status}: ${error.error || response.statusText}`);
 }

 const result = await response.json();

 if (this.config.debug) {
 console.log('Response:', result);
 }
 
 return result;

 } catch (error) {
 lastError = error as Error;
 
 if (attempt < this.config.retries) {
 const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
 if (this.config.debug) {
 console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error.message);
 }
 await this.sleep(delay);
 }
 }
 }

 throw lastError!;
 }

 private getFromCache(key: string): any | null {
 const cached = this.cache.get(key);
 if (cached && cached.expires > Date.now()) {
 return cached.data;
 }
 if (cached) {
 this.cache.delete(key);
 }
 return null;
 }

 private setCache(key: string, data: any, ttl: number): void {
 this.cache.set(key, {
 data,
 expires: Date.now() + ttl
 });
 }

 private generateCalculationCacheKey(input: CalculationInput): string {
 const key = {
 calculatorId: input.calculatorId,
 inputs: input.inputs,
 format: input.format || 'simple',
 precision: input.precision || 2,
 currency: input.currency || 'USD',
 locale: input.locale || 'en-US'
 };
 return `calc:${btoa(JSON.stringify(key))}`;
 }

 private sleep(ms: number): Promise<void> {
 return new Promise(resolve => setTimeout(resolve, ms));
 }
}

// Default export
export default CalculatorSDK;
