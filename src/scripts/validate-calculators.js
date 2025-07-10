#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mock implementations for validation
const mockCalculatorValidator = {
 validateInputs: () => ({ isValid: true, errors: [] }),
};

const mockFormulaEvaluator = {
 evaluate: (formula, variables) => {
 try {
 // Basic validation - check for common formula patterns
 if (typeof formula !== 'string' || formula.trim() === '') {
 throw new Error('Formula cannot be empty');
 }
 
 // Check for basic mathematical operations
 const validPattern = /^[a-zA-Z0-9+\-*/()\s.,^<>=!&|?:]+$/;
 if (!validPattern.test(formula)) {
 throw new Error('Formula contains invalid characters');
 }
 
 return Math.random() * 100; // Mock result
 } catch (error) {
 throw error;
 }
 },
};

console.log('🔍 Validating Calculator Configurations...\n');

// Get all calculator files
const calculatorsDir = path.join(__dirname, '../src/data/calculators');
const files = fs.readdirSync(calculatorsDir).filter(file => file.endsWith('.ts'));

let totalErrors = 0;
let validatedCalculators = 0;

files.forEach(file => {
 const filePath = path.join(calculatorsDir, file);
 const content = fs.readFileSync(filePath, 'utf8');
 
 console.log(`📊 Validating ${file}...`);
 
 try {
 // Extract calculator object from TypeScript file
 const calculatorMatch = content.match(/export const \w+Calculator: CalculatorSEO = ({[\s\S]*?});/);
 
 if (!calculatorMatch) {
 console.error(`❌ Could not parse calculator object in ${file}`);
 totalErrors++;
 return;
 }
 
 // Parse the calculator object (simplified parsing)
 const calculatorStr = calculatorMatch[1];
 
 // Basic validation checks
 const errors = [];
 
 // Check required fields
 if (!calculatorStr.includes('id:')) errors.push('Missing id field');
 if (!calculatorStr.includes('title:')) errors.push('Missing title field');
 if (!calculatorStr.includes('description:')) errors.push('Missing description field');
 if (!calculatorStr.includes('variables:')) errors.push('Missing variables field');
 if (!calculatorStr.includes('formulas:')) errors.push('Missing formulas field');
 if (!calculatorStr.includes('seo:')) errors.push('Missing seo field');
 
 // Check for variables array
 const variablesMatch = calculatorStr.match(/variables:\s*\[([\s\S]*?)\]/);
 if (variablesMatch) {
 const variablesContent = variablesMatch[1];
 if (!variablesContent.trim()) {
 errors.push('Variables array is empty');
 }
 }
 
 // Check for formulas array
 const formulasMatch = calculatorStr.match(/formulas:\s*\[([\s\S]*?)\]/);
 if (formulasMatch) {
 const formulasContent = formulasMatch[1];
 if (!formulasContent.trim()) {
 errors.push('Formulas array is empty');
 } else {
 // Basic formula validation
 const expressionMatches = formulasContent.match(/expression:\s*['"`]([^'"`]+)['"`]/g);
 if (expressionMatches) {
 expressionMatches.forEach(match => {
 const expression = match.match(/expression:\s*['"`]([^'"`]+)['"`]/)[1];
 try {
 mockFormulaEvaluator.evaluate(expression, {});
 } catch (error) {
 errors.push(`Invalid formula expression: ${expression} - ${error.message}`);
 }
 });
 }
 }
 }
 
 // Check SEO fields
 if (calculatorStr.includes('seo:')) {
 if (!calculatorStr.includes('keywords:')) errors.push('SEO missing keywords field');
 if (!calculatorStr.includes('category:')) errors.push('SEO missing category field');
 if (!calculatorStr.includes('difficulty:')) errors.push('SEO missing difficulty field');
 }
 
 if (errors.length > 0) {
 console.error(`❌ Validation errors in ${file}:`);
 errors.forEach(error => console.error(` • ${error}`));
 totalErrors += errors.length;
 } else {
 console.log(`✅ ${file} is valid`);
 validatedCalculators++;
 }
 
 } catch (error) {
 console.error(`❌ Error validating ${file}: ${error.message}`);
 totalErrors++;
 }
 
 console.log('');
});

console.log('📈 Validation Summary:');
console.log(` ✅ Valid calculators: ${validatedCalculators}`);
console.log(` ❌ Total errors: ${totalErrors}`);
console.log(` 📊 Files processed: ${files.length}`);

if (totalErrors > 0) {
 console.log('\n🚨 Please fix the validation errors before deployment.');
 process.exit(1);
} else {
 console.log('\n🎉 All calculators are valid!');
 process.exit(0);
}
