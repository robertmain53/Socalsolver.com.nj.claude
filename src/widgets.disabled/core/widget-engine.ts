/**
 * Calculator Widget Engine - Core rendering and functionality
 * Optimized for performance and maximum compatibility
 */

interface WidgetConfig {
 calculatorId: string;
 theme: 'light' | 'dark' | 'custom';
 size: 'compact' | 'medium' | 'large' | 'fullwidth';
 branding: boolean;
 analytics: boolean;
 customCss?: string;
 onResult?: (result: any) => void;
 onError?: (error: Error) => void;
}

interface WidgetAnalytics {
 trackEvent: (event: string, data: any) => void;
 trackConversion: (value: number) => void;
 trackEngagement: (duration: number) => void;
}

class CalculatorWidget {
 private config: WidgetConfig;
 private container: HTMLElement;
 private analytics: WidgetAnalytics;
 private initialized = false;
 
 constructor(container: string | HTMLElement, config: WidgetConfig) {
 this.container = typeof container === 'string' 
 ? document.getElementById(container)! 
 : container;
 this.config = { ...this.getDefaultConfig(), ...config };
 this.analytics = this.initAnalytics();
 this.init();
 }
 
 private getDefaultConfig(): Partial<WidgetConfig> {
 return {
 theme: 'light',
 size: 'medium',
 branding: true,
 analytics: true
 };
 }
 
 private async init(): Promise<void> {
 try {
 // Load calculator definition
 const calculator = await this.loadCalculator();
 
 // Apply theme and styling
 await this.applyTheme();
 
 // Render widget interface
 this.render(calculator);
 
 // Initialize event listeners
 this.bindEvents();
 
 // Track widget load
 this.analytics.trackEvent('widget_loaded', {
 calculatorId: this.config.calculatorId,
 theme: this.config.theme,
 size: this.config.size
 });
 
 this.initialized = true;
 
 } catch (error) {
 this.handleError(error as Error);
 }
 }
 
 private async loadCalculator(): Promise<any> {
 const response = await fetch(
 `/api/calculators/${this.config.calculatorId}/widget`,
 {
 headers: {
 'Content-Type': 'application/json',
 'X-Widget-Version': '2.0'
 }
 }
 );
 
 if (!response.ok) {
 throw new Error(`Failed to load calculator: ${response.status}`);
 }
 
 return response.json();
 }
 
 private async applyTheme(): Promise<void> {
 const themeUrl = `/api/widgets/themes/${this.config.theme}.css`;
 
 // Check if theme already loaded
 if (document.querySelector(`link[href="${themeUrl}"]`)) {
 return;
 }
 
 // Load theme CSS
 const link = document.createElement('link');
 link.rel = 'stylesheet';
 link.href = themeUrl;
 document.head.appendChild(link);
 
 // Apply custom CSS if provided
 if (this.config.customCss) {
 const style = document.createElement('style');
 style.textContent = this.config.customCss;
 document.head.appendChild(style);
 }
 }
 
 private render(calculator: any): void {
 const widgetHtml = `
 <div class="calc-widget calc-widget--${this.config.size} calc-widget--${this.config.theme}">
 <div class="calc-widget__header">
 <h3 class="calc-widget__title">${calculator.title}</h3>
 ${this.config.branding ? this.renderBranding() : ''}
 </div>
 <div class="calc-widget__body">
 ${this.renderInputs(calculator.inputs)}
 ${this.renderResult()}
 </div>
 <div class="calc-widget__footer">
 ${this.renderActions()}
 </div>
 </div>
 `;
 
 this.container.innerHTML = widgetHtml;
 }
 
 private renderBranding(): string {
 return `
 <div class="calc-widget__branding">
 <a href="https://yourcalculatorsite.com" target="_blank" rel="noopener">
 Powered by YourCalculator
 </a>
 </div>
 `;
 }
 
 private renderInputs(inputs: any[]): string {
 return inputs.map(input => `
 <div class="calc-input calc-input--${input.type}">
 <label class="calc-input__label">${input.label}</label>
 <input 
 type="${input.type}" 
 id="calc-${input.id}"
 class="calc-input__field"
 placeholder="${input.placeholder || ''}"
 ${input.required ? 'required' : ''}
 ${input.min ? `min="${input.min}"` : ''}
 ${input.max ? `max="${input.max}"` : ''}
 />
 ${input.help ? `<div class="calc-input__help">${input.help}</div>` : ''}
 </div>
 `).join('');
 }
 
 private renderResult(): string {
 return `
 <div class="calc-result" id="calc-result">
 <div class="calc-result__label">Result:</div>
 <div class="calc-result__value">Enter values to calculate</div>
 </div>
 `;
 }
 
 private renderActions(): string {
 return `
 <div class="calc-actions">
 <button class="calc-btn calc-btn--primary" id="calc-calculate">
 Calculate
 </button>
 <button class="calc-btn calc-btn--secondary" id="calc-reset">
 Reset
 </button>
 <button class="calc-btn calc-btn--share" id="calc-share">
 Share
 </button>
 </div>
 `;
 }
 
 private bindEvents(): void {
 // Calculate button
 const calculateBtn = this.container.querySelector('#calc-calculate');
 calculateBtn?.addEventListener('click', () => this.calculate());
 
 // Reset button
 const resetBtn = this.container.querySelector('#calc-reset');
 resetBtn?.addEventListener('click', () => this.reset());
 
 // Share button
 const shareBtn = this.container.querySelector('#calc-share');
 shareBtn?.addEventListener('click', () => this.share());
 
 // Auto-calculate on input change
 const inputs = this.container.querySelectorAll('.calc-input__field');
 inputs.forEach(input => {
 input.addEventListener('input', () => {
 clearTimeout((this as any).calcTimeout);
 (this as any).calcTimeout = setTimeout(() => this.calculate(), 500);
 });
 });
 }
 
 private async calculate(): Promise<void> {
 try {
 const inputs = this.getInputValues();
 const startTime = Date.now();
 
 const response = await fetch('/api/calculate', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 calculatorId: this.config.calculatorId,
 inputs,
 widgetId: this.generateWidgetId()
 })
 });
 
 const result = await response.json();
 const duration = Date.now() - startTime;
 
 this.displayResult(result);
 
 // Analytics tracking
 this.analytics.trackEvent('calculation_completed', {
 calculatorId: this.config.calculatorId,
 duration,
 inputs: Object.keys(inputs).length
 });
 
 // Call user callback
 this.config.onResult?.(result);
 
 } catch (error) {
 this.handleError(error as Error);
 }
 }
 
 private getInputValues(): Record<string, any> {
 const inputs: Record<string, any> = {};
 const fields = this.container.querySelectorAll('.calc-input__field');
 
 fields.forEach((field: any) => {
 const id = field.id.replace('calc-', '');
 inputs[id] = field.type === 'number' ? parseFloat(field.value) : field.value;
 });
 
 return inputs;
 }
 
 private displayResult(result: any): void {
 const resultContainer = this.container.querySelector('#calc-result .calc-result__value');
 if (resultContainer) {
 resultContainer.innerHTML = this.formatResult(result);
 }
 }
 
 private formatResult(result: any): string {
 if (typeof result.value === 'number') {
 return `<strong>${result.value.toLocaleString()}</strong> ${result.unit || ''}`;
 }
 return `<strong>${result.value}</strong>`;
 }
 
 private reset(): void {
 const inputs = this.container.querySelectorAll('.calc-input__field');
 inputs.forEach((input: any) => input.value = '');
 
 const resultContainer = this.container.querySelector('#calc-result .calc-result__value');
 if (resultContainer) {
 resultContainer.textContent = 'Enter values to calculate';
 }
 
 this.analytics.trackEvent('widget_reset', {
 calculatorId: this.config.calculatorId
 });
 }
 
 private share(): void {
 const url = `${window.location.origin}/calculators/${this.config.calculatorId}`;
 
 if (navigator.share) {
 navigator.share({
 title: 'Check out this calculator',
 url
 });
 } else {
 // Fallback to clipboard
 navigator.clipboard.writeText(url);
 alert('Calculator URL copied to clipboard!');
 }
 
 this.analytics.trackEvent('widget_shared', {
 calculatorId: this.config.calculatorId,
 method: navigator.share ? 'native' : 'clipboard'
 });
 }
 
 private initAnalytics(): WidgetAnalytics {
 return {
 trackEvent: (event: string, data: any) => {
 if (!this.config.analytics) return;
 
 // Send to analytics endpoint
 fetch('/api/analytics/track', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 event,
 data: {
 ...data,
 widgetId: this.generateWidgetId(),
 timestamp: Date.now(),
 userAgent: navigator.userAgent,
 referrer: document.referrer
 }
 })
 }).catch(() => {}); // Silent fail for analytics
 },
 
 trackConversion: (value: number) => {
 this.analytics.trackEvent('conversion', { value });
 },
 
 trackEngagement: (duration: number) => {
 this.analytics.trackEvent('engagement', { duration });
 }
 };
 }
 
 private generateWidgetId(): string {
 return `widget_${this.config.calculatorId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
 }
 
 private handleError(error: Error): void {
 console.error('Widget Error:', error);
 
 this.analytics.trackEvent('widget_error', {
 error: error.message,
 calculatorId: this.config.calculatorId
 });
 
 this.config.onError?.(error);
 
 // Display user-friendly error
 const errorHtml = `
 <div class="calc-widget__error">
 <p>Sorry, there was an error loading this calculator.</p>
 <button onclick="location.reload()">Try Again</button>
 </div>
 `;
 
 this.container.innerHTML = errorHtml;
 }
 
 // Public API methods
 public getValue(): any {
 return this.getInputValues();
 }
 
 public setValue(values: Record<string, any>): void {
 Object.entries(values).forEach(([key, value]) => {
 const input = this.container.querySelector(`#calc-${key}`) as HTMLInputElement;
 if (input) {
 input.value = value.toString();
 }
 });
 }
 
 public recalculate(): void {
 this.calculate();
 }
 
 public destroy(): void {
 this.container.innerHTML = '';
 this.initialized = false;
 }
}

// Global widget initialization
(window as any).CalculatorWidget = CalculatorWidget;

// Auto-initialize widgets with data attributes
document.addEventListener('DOMContentLoaded', () => {
 const widgets = document.querySelectorAll('[data-calculator-widget]');
 widgets.forEach(element => {
 const config = {
 calculatorId: element.getAttribute('data-calculator-id')!,
 theme: element.getAttribute('data-theme') as any || 'light',
 size: element.getAttribute('data-size') as any || 'medium',
 branding: element.getAttribute('data-branding') !== 'false',
 analytics: element.getAttribute('data-analytics') !== 'false'
 };
 
 new CalculatorWidget(element as HTMLElement, config);
 });
});
