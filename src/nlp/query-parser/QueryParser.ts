/**
 * Advanced Natural Language Query Parser
 * Understands user intent and converts natural language to calculator queries
 */

import { EventEmitter } from 'events';

export interface ParsedQuery {
 intent: string;
 entities: Record<string, any>;
 calculatorType: string;
 confidence: number;
 parameters: Record<string, any>;
 suggestions: string[];
 clarifications?: string[];
}

export interface QueryContext {
 userId?: string;
 sessionId: string;
 previousQueries: string[];
 userProfile?: {
 expertise: 'beginner' | 'intermediate' | 'advanced';
 preferences: Record<string, any>;
 history: any[];
 };
}

export class NaturalLanguageQueryParser extends EventEmitter {
 private intentClassifier: IntentClassifier;
 private entityExtractor: EntityExtractor;
 private calculatorMapper: CalculatorMapper;
 private contextManager: ContextManager;

 constructor() {
 super();
 this.intentClassifier = new IntentClassifier();
 this.entityExtractor = new EntityExtractor();
 this.calculatorMapper = new CalculatorMapper();
 this.contextManager = new ContextManager();
 }

 async parseQuery(query: string, context?: QueryContext): Promise<ParsedQuery> {
 // Preprocess the query
 const preprocessed = this.preprocessQuery(query);
 
 // Classify intent
 const intent = await this.intentClassifier.classify(preprocessed, context);
 
 // Extract entities
 const entities = await this.entityExtractor.extract(preprocessed, intent);
 
 // Map to calculator type
 const calculatorType = await this.calculatorMapper.mapToCalculator(intent, entities);
 
 // Calculate confidence
 const confidence = this.calculateConfidence(intent, entities, calculatorType);
 
 // Generate parameters
 const parameters = this.generateParameters(entities, calculatorType);
 
 // Generate suggestions
 const suggestions = await this.generateSuggestions(intent, entities, context);
 
 // Check for clarifications needed
 const clarifications = this.checkClarifications(entities, calculatorType);
 
 const result: ParsedQuery = {
 intent: intent.type,
 entities,
 calculatorType,
 confidence,
 parameters,
 suggestions,
 clarifications
 };
 
 // Learn from this query for future improvements
 await this.learnFromQuery(query, result, context);
 
 return result;
 }

 async generateResponse(parsedQuery: ParsedQuery, calculationResult?: any): Promise<string> {
 const responseGenerator = new ResponseGenerator();
 return responseGenerator.generate(parsedQuery, calculationResult);
 }

 private preprocessQuery(query: string): string {
 return query
 .toLowerCase()
 .trim()
 .replace(/[^\w\s\.\,\-\$\%]/g, '') // Remove special chars except common ones
 .replace(/\s+/g, ' '); // Normalize whitespace
 }

 private calculateConfidence(intent: any, entities: any, calculatorType: string): number {
 const intentConfidence = intent.confidence || 0;
 const entityConfidence = this.calculateEntityConfidence(entities);
 const mappingConfidence = calculatorType ? 0.8 : 0.2;
 
 return (intentConfidence + entityConfidence + mappingConfidence) / 3;
 }

 private calculateEntityConfidence(entities: Record<string, any>): number {
 const totalEntities = Object.keys(entities).length;
 if (totalEntities === 0) return 0;
 
 const confidenceSum = Object.values(entities).reduce((sum: number, entity: any) => {
 return sum + (entity.confidence || 0);
 }, 0);
 
 return confidenceSum / totalEntities;
 }

 private generateParameters(entities: Record<string, any>, calculatorType: string): Record<string, any> {
 const parameters: Record<string, any> = {};
 
 // Map entities to calculator parameters based on type
 const parameterMappings = this.getParameterMappings(calculatorType);
 
 for (const [entityKey, entity] of Object.entries(entities)) {
 const parameterKey = parameterMappings[entityKey];
 if (parameterKey && entity.value !== undefined) {
 parameters[parameterKey] = entity.value;
 }
 }
 
 return parameters;
 }

 private getParameterMappings(calculatorType: string): Record<string, string> {
 const mappings: Record<string, Record<string, string>> = {
 mortgage: {
 loan_amount: 'principal',
 home_price: 'principal',
 down_payment: 'downPayment',
 interest_rate: 'rate',
 loan_term: 'term',
 years: 'term'
 },
 loan: {
 loan_amount: 'amount',
 principal: 'amount',
 interest_rate: 'rate',
 loan_term: 'term',
 years: 'term'
 },
 savings: {
 initial_amount: 'principal',
 monthly_contribution: 'monthlyContribution',
 interest_rate: 'rate',
 years: 'years'
 },
 bmi: {
 weight: 'weight',
 height: 'height',
 age: 'age'
 },
 investment: {
 initial_investment: 'principal',
 monthly_contribution: 'monthlyContribution',
 interest_rate: 'rate',
 years: 'years'
 }
 };
 
 return mappings[calculatorType] || {};
 }

 private async generateSuggestions(intent: any, entities: any, context?: QueryContext): Promise<string[]> {
 const suggestions: string[] = [];
 
 // Generate suggestions based on missing entities
 const missingEntities = this.findMissingEntities(intent.type, entities);
 for (const missing of missingEntities) {
 suggestions.push(this.generateSuggestionForMissingEntity(missing, intent.type));
 }
 
 // Generate suggestions based on user history
 if (context?.userProfile?.history) {
 const historySuggestions = this.generateHistoryBasedSuggestions(context.userProfile.history, intent.type);
 suggestions.push(...historySuggestions);
 }
 
 // Generate alternative calculation suggestions
 const alternatives = this.generateAlternativeCalculations(intent.type);
 suggestions.push(...alternatives);
 
 return suggestions.slice(0, 5); // Limit to top 5 suggestions
 }

 private checkClarifications(entities: Record<string, any>, calculatorType: string): string[] | undefined {
 const clarifications: string[] = [];
 const requiredEntities = this.getRequiredEntities(calculatorType);
 
 for (const required of requiredEntities) {
 if (!entities[required] || entities[required].confidence < 0.7) {
 clarifications.push(this.generateClarificationQuestion(required, calculatorType));
 }
 }
 
 return clarifications.length > 0 ? clarifications : undefined;
 }

 private findMissingEntities(intentType: string, entities: Record<string, any>): string[] {
 const requiredEntities = this.getRequiredEntities(intentType);
 return requiredEntities.filter(entity => !entities[entity]);
 }

 private getRequiredEntities(calculatorType: string): string[] {
 const requirements: Record<string, string[]> = {
 mortgage: ['loan_amount', 'interest_rate', 'loan_term'],
 loan: ['loan_amount', 'interest_rate', 'loan_term'],
 savings: ['initial_amount', 'interest_rate', 'years'],
 bmi: ['weight', 'height'],
 investment: ['initial_investment', 'interest_rate', 'years']
 };
 
 return requirements[calculatorType] || [];
 }

 private generateSuggestionForMissingEntity(entity: string, calculatorType: string): string {
 const suggestions: Record<string, string> = {
 loan_amount: "What's the loan amount you're considering?",
 interest_rate: "What interest rate are you expecting?",
 loan_term: "How many years is the loan term?",
 weight: "What's your weight?",
 height: "What's your height?",
 initial_investment: "How much are you planning to invest initially?"
 };
 
 return suggestions[entity] || `Could you provide the ${entity.replace('_', ' ')}?`;
 }

 private generateHistoryBasedSuggestions(history: any[], intentType: string): string[] {
 // Analyze user's previous calculations to generate smart suggestions
 return [
 "Based on your previous calculations, you might also want to consider...",
 "Similar to your last calculation, but with current market rates..."
 ];
 }

 private generateAlternativeCalculations(intentType: string): string[] {
 const alternatives: Record<string, string[]> = {
 mortgage: [
 "Would you like to see how different down payments affect your monthly payment?",
 "Want to compare 15-year vs 30-year mortgage terms?"
 ],
 loan: [
 "Would you like to see the total interest you'll pay over the loan term?",
 "Want to compare different loan amounts?"
 ],
 savings: [
 "Would you like to see how inflation affects your savings?",
 "Want to compare different contribution schedules?"
 ]
 };
 
 return alternatives[intentType] || [];
 }

 private generateClarificationQuestion(entity: string, calculatorType: string): string {
 const questions: Record<string, string> = {
 loan_amount: "What's the total amount you want to borrow?",
 interest_rate: "What interest rate are you expecting? (e.g., 3.5%)",
 loan_term: "How many years do you want the loan term to be?",
 weight: "What's your current weight?",
 height: "What's your height?"
 };
 
 return questions[entity] || `Could you clarify the ${entity.replace('_', ' ')}?`;
 }

 private async learnFromQuery(query: string, result: ParsedQuery, context?: QueryContext): Promise<void> {
 // Store the query and its parsing result for machine learning improvements
 const learningData = {
 query,
 result,
 context,
 timestamp: new Date(),
 feedback: null // Will be updated when user provides feedback
 };
 
 // In a real implementation, this would store data for ML model training
 console.log('Learning from query:', learningData);
 }
}

// Intent Classification System
class IntentClassifier {
 private patterns: Map<string, RegExp[]> = new Map();
 
 constructor() {
 this.initializePatterns();
 }
 
 private initializePatterns(): void {
 this.patterns.set('mortgage_calculation', [
 /(?:mortgage|home\s+loan|house\s+payment)/i,
 /(?:monthly\s+payment|house\s+afford)/i,
 /(?:home\s+buying|real\s+estate)/i
 ]);
 
 this.patterns.set('loan_calculation', [
 /(?:loan|borrow|financing)/i,
 /(?:personal\s+loan|auto\s+loan|car\s+loan)/i,
 /(?:monthly\s+payment|total\s+interest)/i
 ]);
 
 this.patterns.set('savings_calculation', [
 /(?:save|savings|saving)/i,
 /(?:retirement|future\s+value)/i,
 /(?:compound\s+interest|investment\s+growth)/i
 ]);
 
 this.patterns.set('bmi_calculation', [
 /(?:bmi|body\s+mass\s+index)/i,
 /(?:weight|height|health)/i,
 /(?:fitness|diet)/i
 ]);
 
 this.patterns.set('investment_calculation', [
 /(?:invest|investment|portfolio)/i,
 /(?:return|profit|gain)/i,
 /(?:stock|bond|mutual\s+fund)/i
 ]);
 }
 
 async classify(query: string, context?: QueryContext): Promise<any> {
 const scores: Record<string, number> = {};
 
 for (const [intent, patterns] of this.patterns) {
 let score = 0;
 
 for (const pattern of patterns) {
 if (pattern.test(query)) {
 score += 1;
 }
 }
 
 // Normalize score
 scores[intent] = score / patterns.length;
 }
 
 // Find the highest scoring intent
 const sortedIntents = Object.entries(scores)
 .sort(([,a], [,b]) => b - a)
 .filter(([,score]) => score > 0);
 
 if (sortedIntents.length === 0) {
 return { type: 'unknown', confidence: 0 };
 }
 
 const [topIntent, confidence] = sortedIntents[0];
 
 return {
 type: topIntent,
 confidence: Math.min(confidence * 1.2, 1), // Boost confidence slightly
 alternatives: sortedIntents.slice(1, 3).map(([intent, score]) => ({ intent, score }))
 };
 }
}

// Entity Extraction System
class EntityExtractor {
 private entityPatterns: Map<string, RegExp[]> = new Map();
 
 constructor() {
 this.initializeEntityPatterns();
 }
 
 private initializeEntityPatterns(): void {
 // Monetary amounts
 this.entityPatterns.set('loan_amount', [
 /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|bucks?)?/gi,
 /(\d+)k\s*(?:dollars?)?/gi,
 /(\d+)\s*(?:thousand|million)/gi
 ]);
 
 // Interest rates
 this.entityPatterns.set('interest_rate', [
 /(\d+(?:\.\d+)?)\s*%\s*(?:interest|rate|apr)?/gi,
 /(\d+(?:\.\d+)?)\s*percent/gi,
 /rate\s*(?:of\s*)?(\d+(?:\.\d+)?)/gi
 ]);
 
 // Time periods
 this.entityPatterns.set('loan_term', [
 /(\d+)\s*years?/gi,
 /(\d+)\s*months?/gi,
 /(\d+)(?:yr|year)/gi
 ]);
 
 // Weight measurements
 this.entityPatterns.set('weight', [
 /(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?|kg|kilograms?)/gi,
 /weigh\s*(\d+(?:\.\d+)?)/gi
 ]);
 
 // Height measurements
 this.entityPatterns.set('height', [
 /(\d+)\s*(?:feet?|ft)\s*(\d+)\s*(?:inches?|in)/gi,
 /(\d+(?:\.\d+)?)\s*(?:cm|centimeters?|meters?|m)/gi,
 /(\d+)['\"](\d+)[\"]/gi // 5'10"
 ]);
 }
 
 async extract(query: string, intent: any): Promise<Record<string, any>> {
 const entities: Record<string, any> = {};
 
 for (const [entityType, patterns] of this.entityPatterns) {
 for (const pattern of patterns) {
 const matches = Array.from(query.matchAll(pattern));
 
 if (matches.length > 0) {
 const match = matches[0];
 const value = this.parseEntityValue(entityType, match);
 
 if (value !== null) {
 entities[entityType] = {
 value,
 confidence: 0.9,
 source: match[0],
 position: match.index
 };
 break; // Use first match for each entity type
 }
 }
 }
 }
 
 return entities;
 }
 
 private parseEntityValue(entityType: string, match: RegExpMatchArray): any {
 switch (entityType) {
 case 'loan_amount':
 return this.parseMonetaryAmount(match);
 case 'interest_rate':
 return parseFloat(match[1]);
 case 'loan_term':
 return this.parseTimePeriod(match);
 case 'weight':
 return this.parseWeight(match);
 case 'height':
 return this.parseHeight(match);
 default:
 return match[1] ? parseFloat(match[1]) : null;
 }
 }
 
 private parseMonetaryAmount(match: RegExpMatchArray): number {
 const value = match[1] || match[0];
 
 if (value.includes('k')) {
 return parseFloat(value.replace('k', '')) * 1000;
 }
 
 if (value.includes('thousand')) {
 return parseFloat(match[1]) * 1000;
 }
 
 if (value.includes('million')) {
 return parseFloat(match[1]) * 1000000;
 }
 
 return parseFloat(value.replace(/,/g, ''));
 }
 
 private parseTimePeriod(match: RegExpMatchArray): number {
 const value = parseFloat(match[1]);
 const unit = match[0].toLowerCase();
 
 if (unit.includes('month')) {
 return value / 12; // Convert to years
 }
 
 return value; // Assume years
 }
 
 private parseWeight(match: RegExpMatchArray): { value: number; unit: string } {
 const value = parseFloat(match[1]);
 const unit = match[0].toLowerCase().includes('kg') ? 'kg' : 'lbs';
 
 return { value, unit };
 }
 
 private parseHeight(match: RegExpMatchArray): { value: number; unit: string } {
 if (match[2]) {
 // Feet and inches format
 const feet = parseFloat(match[1]);
 const inches = parseFloat(match[2]);
 return { value: feet * 12 + inches, unit: 'inches' };
 }
 
 const value = parseFloat(match[1]);
 const unit = match[0].toLowerCase().includes('cm') ? 'cm' : 'inches';
 
 return { value, unit };
 }
}

// Calculator Mapping System
class CalculatorMapper {
 private intentToCalculator: Map<string, string> = new Map();
 
 constructor() {
 this.initializeMappings();
 }
 
 private initializeMappings(): void {
 this.intentToCalculator.set('mortgage_calculation', 'mortgage');
 this.intentToCalculator.set('loan_calculation', 'loan');
 this.intentToCalculator.set('savings_calculation', 'savings');
 this.intentToCalculator.set('bmi_calculation', 'bmi');
 this.intentToCalculator.set('investment_calculation', 'investment');
 }
 
 async mapToCalculator(intent: any, entities: Record<string, any>): Promise<string> {
 const calculatorType = this.intentToCalculator.get(intent.type);
 
 if (!calculatorType) {
 // Try to infer from entities
 return this.inferCalculatorFromEntities(entities);
 }
 
 return calculatorType;
 }
 
 private inferCalculatorFromEntities(entities: Record<string, any>): string {
 const entityTypes = Object.keys(entities);
 
 if (entityTypes.includes('weight') && entityTypes.includes('height')) {
 return 'bmi';
 }
 
 if (entityTypes.includes('loan_amount') && entityTypes.includes('interest_rate')) {
 return 'loan';
 }
 
 if (entityTypes.includes('investment') || entityTypes.includes('portfolio')) {
 return 'investment';
 }
 
 return 'general'; // Fallback
 }
}

// Context Management System
class ContextManager {
 private contexts: Map<string, any> = new Map();
 
 getContext(sessionId: string): any {
 return this.contexts.get(sessionId) || {};
 }
 
 updateContext(sessionId: string, update: any): void {
 const existing = this.getContext(sessionId);
 this.contexts.set(sessionId, { ...existing, ...update });
 }
 
 clearContext(sessionId: string): void {
 this.contexts.delete(sessionId);
 }
}

// Response Generation System
class ResponseGenerator {
 async generate(parsedQuery: ParsedQuery, calculationResult?: any): Promise<string> {
 if (calculationResult) {
 return this.generateResultResponse(parsedQuery, calculationResult);
 } else {
 return this.generateIntentResponse(parsedQuery);
 }
 }
 
 private generateResultResponse(parsedQuery: ParsedQuery, result: any): string {
 const templates: Record<string, string> = {
 mortgage: "Based on your query, here's your mortgage calculation: Your monthly payment would be ${monthlyPayment}. Over the life of the loan, you'll pay ${totalInterest} in interest.",
 loan: "For your loan calculation: Your monthly payment would be ${monthlyPayment}. The total amount paid will be ${totalPaid}.",
 savings: "Your savings projection: After ${years} years, your savings will grow to ${futureValue}.",
 bmi: "Your BMI calculation: Your BMI is ${bmi}, which is considered ${category}."
 };
 
 const template = templates[parsedQuery.calculatorType] || "Here are your calculation results: ${result}";
 
 return this.replaceTokens(template, result);
 }
 
 private generateIntentResponse(parsedQuery: ParsedQuery): string {
 if (parsedQuery.clarifications && parsedQuery.clarifications.length > 0) {
 return `I understand you want to calculate ${parsedQuery.calculatorType}. ${parsedQuery.clarifications[0]}`;
 }
 
 if (parsedQuery.confidence < 0.5) {
 return `I'm not quite sure what you'd like to calculate. Could you be more specific? For example, you could ask "Calculate my mortgage payment for a $300,000 home with 3.5% interest rate for 30 years".`;
 }
 
 return `I'll help you with a ${parsedQuery.calculatorType} calculation. Let me set that up for you.`;
 }
 
 private replaceTokens(template: string, data: any): string {
 return template.replace(/\$\{(\w+)\}/g, (match, key) => {
 return data[key]?.toLocaleString() || match;
 });
 }
}
