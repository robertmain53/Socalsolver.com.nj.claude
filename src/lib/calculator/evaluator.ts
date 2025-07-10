import { Parser } from 'expr-eval';
import { CalculatorFormula, CalculatorVariable } from '@/types/calculator';

export class FormulaEvaluator {
 private parser: Parser;
 
 constructor() {
 this.parser = new Parser();
 }

 /**
 * Evaluate a formula with given variables
 */
 evaluate(
 formula: CalculatorFormula,
 variables: Record<string, any>
 ): number | string | null {
 try {
 // Convert variables to proper types
 const processedVars = this.processVariables(variables);
 
 // Parse and evaluate the formula
 const expr = this.parser.parse(formula.expression);
 const result = expr.evaluate(processedVars);
 
 // Format result based on formula result type
 return this.formatResult(result, formula.resultType);
 } catch (error) {
 console.error('Formula evaluation error:', error);
 return null;
 }
 }

 /**
 * Get step-by-step calculation breakdown
 */
 getSteps(
 formula: CalculatorFormula,
 variables: Record<string, any>
 ): Array<{ step: string; value: number | string; description?: string }> {
 const steps: Array<{ step: string; value: number | string; description?: string }> = [];
 
 try {
 const processedVars = this.processVariables(variables);
 
 // Add input variables as first steps
 Object.entries(processedVars).forEach(([key, value]) => {
 steps.push({
 step: key,
 value: value,
 description: `Input: ${key}`
 });
 });
 
 // Evaluate main formula
 const expr = this.parser.parse(formula.expression);
 const result = expr.evaluate(processedVars);
 
 steps.push({
 step: formula.expression,
 value: this.formatResult(result, formula.resultType),
 description: formula.description || 'Final calculation'
 });
 
 return steps;
 } catch (error) {
 console.error('Step calculation error:', error);
 return [];
 }
 }

 /**
 * Validate if formula can be evaluated with given variables
 */
 validate(
 formula: CalculatorFormula,
 variables: Record<string, any>
 ): { isValid: boolean; errors: string[] } {
 const errors: string[] = [];
 
 try {
 const processedVars = this.processVariables(variables);
 const expr = this.parser.parse(formula.expression);
 
 // Check if all required variables are present
 const requiredVars = expr.variables();
 const missingVars = requiredVars.filter(v => !(v in processedVars));
 
 if (missingVars.length > 0) {
 errors.push(`Missing variables: ${missingVars.join(', ')}`);
 }
 
 // Try to evaluate
 expr.evaluate(processedVars);
 
 } catch (error) {
 errors.push(`Formula error: ${error.message}`);
 }
 
 return {
 isValid: errors.length === 0,
 errors
 };
 }

 private processVariables(variables: Record<string, any>): Record<string, number> {
 const processed: Record<string, number> = {};
 
 Object.entries(variables).forEach(([key, value]) => {
 if (typeof value === 'number') {
 processed[key] = value;
 } else if (typeof value === 'string') {
 const numValue = parseFloat(value);
 if (!isNaN(numValue)) {
 processed[key] = numValue;
 }
 }
 });
 
 return processed;
 }

 private formatResult(result: any, resultType?: string): number | string {
 if (typeof result !== 'number') {
 return result;
 }
 
 switch (resultType) {
 case 'currency':
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency: 'USD'
 }).format(result);
 case 'percentage':
 return `${(result * 100).toFixed(2)}%`;
 case 'decimal':
 return result.toFixed(2);
 case 'integer':
 return Math.round(result);
 default:
 return result;
 }
 }
}

export const formulaEvaluator = new FormulaEvaluator();
