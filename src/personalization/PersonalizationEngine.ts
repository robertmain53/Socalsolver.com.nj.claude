/**
 * Advanced Personalization Engine
 * AI-powered recommendations and user experience customization
 */

import { User, IUser } from '../users/models/User';
import { CalculationHistory, ICalculationHistory } from '../history/CalculationHistory';

interface PersonalizationData {
 userId: string;
 calculatorPreferences: Array<{
 calculatorId: string;
 frequency: number;
 lastUsed: Date;
 avgSessionTime: number;
 preferredInputs: Record<string, any>;
 }>;
 behaviorPatterns: {
 mostActiveTimeOfDay: number; // Hour 0-23
 mostActiveDayOfWeek: number; // 0-6 (Sunday-Saturday)
 averageSessionLength: number; // minutes
 calculationComplexity: 'simple' | 'moderate' | 'complex';
 devicePreference: 'mobile' | 'desktop' | 'tablet';
 };
 interests: string[];
 skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export class PersonalizationEngine {
 
 async analyzeUserBehavior(userId: string): Promise<PersonalizationData> {
 const user = await User.findById(userId);
 if (!user) throw new Error('User not found');
 
 const history = await CalculationHistory.find({ userId })
 .sort({ timestamp: -1 })
 .limit(1000); // Analyze last 1000 calculations
 
 if (history.length === 0) {
 return this.getDefaultPersonalization(userId);
 }
 
 const calculatorPreferences = this.analyzeCalculatorUsage(history);
 const behaviorPatterns = this.analyzeBehaviorPatterns(history);
 const interests = this.inferInterests(history, calculatorPreferences);
 const skillLevel = this.assessSkillLevel(history);
 
 return {
 userId,
 calculatorPreferences,
 behaviorPatterns,
 interests,
 skillLevel
 };
 }
 
 async getRecommendations(userId: string, context: {
 currentCalculator?: string;
 limit?: number;
 type?: 'similar' | 'complementary' | 'trending' | 'personalized';
 } = {}): Promise<Array<{
 calculatorId: string;
 score: number;
 reason: string;
 category: string;
 }>> {
 
 const { limit = 10, type = 'personalized' } = context;
 const personalization = await this.analyzeUserBehavior(userId);
 
 let recommendations: any[] = [];
 
 switch (type) {
 case 'similar':
 recommendations = await this.getSimilarCalculators(context.currentCalculator, personalization);
 break;
 case 'complementary':
 recommendations = await this.getComplementaryCalculators(context.currentCalculator, personalization);
 break;
 case 'trending':
 recommendations = await this.getTrendingCalculators(personalization);
 break;
 default:
 recommendations = await this.getPersonalizedRecommendations(personalization);
 }
 
 // Sort by score and limit results
 return recommendations
 .sort((a, b) => b.score - a.score)
 .slice(0, limit);
 }
 
 async customizeUserExperience(userId: string): Promise<{
 dashboard: any;
 quickAccess: string[];
 themes: any;
 layout: any;
 }> {
 
 const user = await User.findById(userId);
 const personalization = await this.analyzeUserBehavior(userId);
 
 return {
 dashboard: await this.customizeDashboard(personalization),
 quickAccess: this.getQuickAccessCalculators(personalization),
 themes: this.getThemeRecommendations(user, personalization),
 layout: this.getLayoutPreferences(personalization)
 };
 }
 
 async trackUserInteraction(userId: string, interaction: {
 type: 'click' | 'hover' | 'scroll' | 'focus' | 'calculate' | 'export' | 'share';
 target: string;
 context: Record<string, any>;
 timestamp: Date;
 }): Promise<void> {
 
 // Store interaction data for machine learning
 await this.storeInteraction(userId, interaction);
 
 // Update real-time personalization
 await this.updateRealtimePersonalization(userId, interaction);
 }
 
 async getPredictiveInputs(userId: string, calculatorId: string): Promise<Record<string, any>> {
 const personalization = await this.analyzeUserBehavior(userId);
 const calculatorPref = personalization.calculatorPreferences
 .find(pref => pref.calculatorId === calculatorId);
 
 if (!calculatorPref) return {};
 
 // Return commonly used input values
 return calculatorPref.preferredInputs;
 }
 
 async getSmartDefaults(userId: string, calculatorId: string): Promise<Record<string, any>> {
 const user = await User.findById(userId);
 const recentCalculations = await CalculationHistory.find({
 userId,
 calculatorId
 }).sort({ timestamp: -1 }).limit(5);
 
 if (recentCalculations.length === 0) {
 return this.getCalculatorDefaults(calculatorId);
 }
 
 // Analyze recent inputs to suggest smart defaults
 const smartDefaults: Record<string, any> = {};
 const inputKeys = Object.keys(recentCalculations[0].inputs);
 
 for (const key of inputKeys) {
 const values = recentCalculations
 .map(calc => calc.inputs[key])
 .filter(val => val !== undefined && val !== null);
 
 if (values.length > 0) {
 if (typeof values[0] === 'number') {
 // Use median for numeric values
 smartDefaults[key] = this.calculateMedian(values);
 } else {
 // Use most frequent for non-numeric values
 smartDefaults[key] = this.getMostFrequent(values);
 }
 }
 }
 
 return smartDefaults;
 }
 
 // Private methods
 private analyzeCalculatorUsage(history: ICalculationHistory[]): any[] {
 const usage = new Map<string, {
 count: number;
 lastUsed: Date;
 totalTime: number;
 inputs: any[];
 }>();
 
 for (const calc of history) {
 const existing = usage.get(calc.calculatorId) || {
 count: 0,
 lastUsed: new Date(0),
 totalTime: 0,
 inputs: []
 };
 
 existing.count++;
 existing.lastUsed = calc.timestamp > existing.lastUsed ? calc.timestamp : existing.lastUsed;
 existing.totalTime += calc.calculationTime || 0;
 existing.inputs.push(calc.inputs);
 
 usage.set(calc.calculatorId, existing);
 }
 
 return Array.from(usage.entries()).map(([calculatorId, data]) => ({
 calculatorId,
 frequency: data.count,
 lastUsed: data.lastUsed,
 avgSessionTime: data.totalTime / data.count,
 preferredInputs: this.extractPreferredInputs(data.inputs)
 }));
 }
 
 private analyzeBehaviorPatterns(history: ICalculationHistory[]): any {
 const hourCounts = new Array(24).fill(0);
 const dayCounts = new Array(7).fill(0);
 const sessionTimes: number[] = [];
 const deviceTypes = new Map<string, number>();
 
 for (const calc of history) {
 const hour = calc.timestamp.getHours();
 const day = calc.timestamp.getDay();
 
 hourCounts[hour]++;
 dayCounts[day]++;
 
 if (calc.calculationTime) {
 sessionTimes.push(calc.calculationTime);
 }
 
 // Analyze device type from user agent
 const deviceType = this.getDeviceType(calc.userAgent);
 deviceTypes.set(deviceType, (deviceTypes.get(deviceType) || 0) + 1);
 }
 
 return {
 mostActiveTimeOfDay: hourCounts.indexOf(Math.max(...hourCounts)),
 mostActiveDayOfWeek: dayCounts.indexOf(Math.max(...dayCounts)),
 averageSessionLength: sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length || 0,
 calculationComplexity: this.assessComplexity(history),
 devicePreference: this.getMostFrequentDevice(deviceTypes)
 };
 }
 
 private inferInterests(history: ICalculationHistory[], preferences: any[]): string[] {
 const interests = new Set<string>();
 
 // Map calculators to interest categories
 const categoryMap = {
 'mortgage': ['finance', 'real-estate', 'loans'],
 'loan': ['finance', 'loans', 'credit'],
 'savings': ['finance', 'investment', 'planning'],
 'investment': ['finance', 'investment', 'portfolio'],
 'tax': ['finance', 'taxes', 'planning'],
 'bmi': ['health', 'fitness', 'wellness'],
 'calorie': ['health', 'nutrition', 'fitness'],
 'pregnancy': ['health', 'pregnancy', 'family'],
 'age': ['health', 'demographics'],
 'statistics': ['math', 'statistics', 'analytics'],
 'geometry': ['math', 'geometry', 'engineering'],
 'physics': ['science', 'physics', 'engineering'],
 'chemistry': ['science', 'chemistry', 'laboratory']
 };
 
 for (const pref of preferences) {
 const categories = categoryMap[pref.calculatorId as keyof typeof categoryMap] || [];
 categories.forEach(cat => interests.add(cat));
 }
 
 return Array.from(interests);
 }
 
 private assessSkillLevel(history: ICalculationHistory[]): 'beginner' | 'intermediate' | 'advanced' {
 const uniqueCalculators = new Set(history.map(h => h.calculatorId)).size;
 const avgComplexity = this.calculateAverageComplexity(history);
 const frequency = history.length;
 
 if (uniqueCalculators <= 3 && frequency <= 10 && avgComplexity < 0.3) {
 return 'beginner';
 } else if (uniqueCalculators <= 10 && frequency <= 50 && avgComplexity < 0.7) {
 return 'intermediate';
 } else {
 return 'advanced';
 }
 }
 
 private async getSimilarCalculators(currentCalculator: string, personalization: PersonalizationData): Promise<any[]> {
 // Implementation for finding similar calculators
 return [];
 }
 
 private async getComplementaryCalculators(currentCalculator: string, personalization: PersonalizationData): Promise<any[]> {
 // Implementation for finding complementary calculators
 return [];
 }
 
 private async getTrendingCalculators(personalization: PersonalizationData): Promise<any[]> {
 // Implementation for trending calculators
 return [];
 }
 
 private async getPersonalizedRecommendations(personalization: PersonalizationData): Promise<any[]> {
 // Machine learning-based personalized recommendations
 return [];
 }
 
 private async customizeDashboard(personalization: PersonalizationData): Promise<any> {
 return {
 layout: 'grid',
 widgets: [
 { type: 'recent-calculations', position: { x: 0, y: 0, w: 6, h: 4 } },
 { type: 'favorite-calculators', position: { x: 6, y: 0, w: 6, h: 4 } },
 { type: 'recommendations', position: { x: 0, y: 4, w: 12, h: 3 } },
 { type: 'usage-analytics', position: { x: 0, y: 7, w: 8, h: 4 } },
 { type: 'quick-actions', position: { x: 8, y: 7, w: 4, h: 4 } }
 ]
 };
 }
 
 private getQuickAccessCalculators(personalization: PersonalizationData): string[] {
 return personalization.calculatorPreferences
 .slice(0, 5)
 .map(pref => pref.calculatorId);
 }
 
 private getThemeRecommendations(user: IUser, personalization: PersonalizationData): any {
 const baseTheme = user.preferences.theme;
 
 return {
 recommended: baseTheme,
 alternatives: ['light', 'dark', 'auto'].filter(t => t !== baseTheme),
 customizations: {
 accentColor: this.getRecommendedAccentColor(personalization),
 layout: personalization.behaviorPatterns.devicePreference === 'mobile' ? 'compact' : 'comfortable'
 }
 };
 }
 
 private getLayoutPreferences(personalization: PersonalizationData): any {
 return {
 calculatorLayout: personalization.skillLevel === 'advanced' ? 'advanced' : 'simple',
 resultsDisplay: personalization.skillLevel === 'beginner' ? 'simple' : 'detailed',
 navigationStyle: personalization.behaviorPatterns.devicePreference === 'mobile' ? 'bottom' : 'sidebar'
 };
 }
 
 // Utility methods
 private getDefaultPersonalization(userId: string): PersonalizationData {
 return {
 userId,
 calculatorPreferences: [],
 behaviorPatterns: {
 mostActiveTimeOfDay: 12,
 mostActiveDayOfWeek: 1,
 averageSessionLength: 5,
 calculationComplexity: 'simple',
 devicePreference: 'desktop'
 },
 interests: [],
 skillLevel: 'beginner'
 };
 }
 
 private extractPreferredInputs(inputs: any[]): Record<string, any> {
 // Analyze input patterns and extract preferred values
 const preferred: Record<string, any> = {};
 
 if (inputs.length === 0) return preferred;
 
 const keys = Object.keys(inputs[0]);
 
 for (const key of keys) {
 const values = inputs.map(input => input[key]).filter(v => v !== undefined);
 if (values.length > 0) {
 if (typeof values[0] === 'number') {
 preferred[key] = this.calculateMedian(values);
 } else {
 preferred[key] = this.getMostFrequent(values);
 }
 }
 }
 
 return preferred;
 }
 
 private calculateMedian(values: number[]): number {
 const sorted = values.sort((a, b) => a - b);
 const mid = Math.floor(sorted.length / 2);
 return sorted.length % 2 === 0 
 ? (sorted[mid - 1] + sorted[mid]) / 2 
 : sorted[mid];
 }
 
 private getMostFrequent(values: any[]): any {
 const frequency = new Map();
 values.forEach(value => frequency.set(value, (frequency.get(value) || 0) + 1));
 return Array.from(frequency.entries()).reduce((a, b) => frequency.get(a[0]) > frequency.get(b[0]) ? a : b)[0];
 }
 
 private getDeviceType(userAgent: string): string {
 if (!userAgent) return 'unknown';
 
 if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
 return /iPad/i.test(userAgent) ? 'tablet' : 'mobile';
 }
 return 'desktop';
 }
 
 private assessComplexity(history: ICalculationHistory[]): 'simple' | 'moderate' | 'complex' {
 // Analyze calculation complexity based on input counts and types
 const avgInputs = history.reduce((sum, calc) => sum + Object.keys(calc.inputs).length, 0) / history.length;
 
 if (avgInputs <= 3) return 'simple';
 if (avgInputs <= 6) return 'moderate';
 return 'complex';
 }
 
 private calculateAverageComplexity(history: ICalculationHistory[]): number {
 // Return complexity score between 0 and 1
 return history.reduce((sum, calc) => {
 const inputCount = Object.keys(calc.inputs).length;
 return sum + Math.min(inputCount / 10, 1);
 }, 0) / history.length;
 }
 
 private getMostFrequentDevice(deviceTypes: Map<string, number>): string {
 let maxCount = 0;
 let mostFrequent = 'desktop';
 
 deviceTypes.forEach((count, device) => {
 if (count > maxCount) {
 maxCount = count;
 mostFrequent = device;
 }
 });
 
 return mostFrequent;
 }
 
 private getCalculatorDefaults(calculatorId: string): Record<string, any> {
 // Return default values for calculator
 return {};
 }
 
 private getRecommendedAccentColor(personalization: PersonalizationData): string {
 // Return recommended accent color based on usage patterns
 const colors = ['blue', 'green', 'purple', 'orange', 'red'];
 return colors[Math.floor(Math.random() * colors.length)];
 }
 
 private async storeInteraction(userId: string, interaction: any): Promise<void> {
 // Store interaction data for ML analysis
 }
 
 private async updateRealtimePersonalization(userId: string, interaction: any): Promise<void> {
 // Update real-time personalization based on interaction
 }
}

// Export singleton instance
export const personalizationEngine = new PersonalizationEngine();
