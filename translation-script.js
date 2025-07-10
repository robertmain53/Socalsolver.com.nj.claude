// translation-script.js
// OpenAI Translation Script for SocalSolver.com
// Translates all category descriptions from English to Italian, French, and Spanish

import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

// Initialize OpenAI
const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY, // Set your API key in environment variables
});

// Complete categories structure for translation
const categoriesStructure = {
 en: {
 finance: {
 name: "Finance",
 description: "Comprehensive financial calculators for loans, investments, budgeting, and tax planning",
 subcategories: {
 loans_mortgages: {
 name: "Loans & Mortgages",
 description: "Calculate mortgage payments, loan affordability, and amortization schedules",
 calculators: {
 mortgage_payment: { 
 name: "Mortgage Payment", 
 description: "Calculate monthly mortgage payments with principal, interest, taxes, and insurance" 
 },
 mortgage_refinance: { 
 name: "Mortgage Refinance", 
 description: "Analyze refinancing benefits and break-even points for your mortgage" 
 },
 loan_affordability: { 
 name: "Loan Affordability", 
 description: "Determine how much you can borrow based on income and expenses" 
 },
 loan_amortization: { 
 name: "Loan Amortization", 
 description: "Generate detailed amortization schedules showing payment breakdowns" 
 },
 personal_loan: { 
 name: "Personal Loan", 
 description: "Calculate personal loan payments and total interest costs" 
 },
 car_loan: { 
 name: "Car Loan", 
 description: "Auto loan payment calculator with trade-in value consideration" 
 },
 student_loan: { 
 name: "Student Loan", 
 description: "Student loan payment calculator with deferment and forgiveness options" 
 }
 }
 },
 investment_savings: {
 name: "Investment & Savings",
 description: "Investment returns, compound interest, and retirement planning tools",
 calculators: {
 compound_interest: { 
 name: "Compound Interest", 
 description: "Calculate compound interest growth with various compounding frequencies" 
 },
 simple_interest: { 
 name: "Simple Interest", 
 description: "Calculate simple interest for short-term investments and loans" 
 },
 roi: { 
 name: "Return on Investment (ROI)", 
 description: "Calculate investment returns and compare different investment options" 
 },
 savings_goal: { 
 name: "Savings Goal", 
 description: "Plan monthly savings needed to reach your financial targets" 
 },
 retirement_planning: { 
 name: "Retirement Planning", 
 description: "Plan for retirement needs with inflation and lifestyle considerations" 
 },
 dividend_yield: { 
 name: "Dividend Yield", 
 description: "Calculate dividend yield and total return from dividend-paying stocks" 
 },
 pe_ratio: { 
 name: "P/E Ratio", 
 description: "Calculate price-to-earnings ratio for stock valuation analysis" 
 }
 }
 },
 budgeting_personal: {
 name: "Budgeting & Personal Finance",
 description: "Personal budgeting, expense tracking, and financial health calculators",
 calculators: {
 monthly_budget: { 
 name: "Monthly Budget", 
 description: "Create and track monthly budget with income and expense categories" 
 },
 expense_tracker: { 
 name: "Expense Tracker", 
 description: "Track and categorize daily expenses for better financial control" 
 },
 net_worth: { 
 name: "Net Worth", 
 description: "Calculate total net worth by comparing assets and liabilities" 
 },
 debt_to_income: { 
 name: "Debt-to-Income Ratio", 
 description: "Calculate debt-to-income ratio for loan qualification assessment" 
 },
 emergency_fund: { 
 name: "Emergency Fund", 
 description: "Calculate recommended emergency fund size based on monthly expenses" 
 }
 }
 }
 }
 },
 mathematics: {
 name: "Mathematics",
 description: "Advanced mathematical calculators for algebra, geometry, calculus, and statistics",
 subcategories: {
 basic_arithmetic: {
 name: "Basic Arithmetic",
 description: "Essential arithmetic operations and percentage calculations",
 calculators: {
 percentage: { 
 name: "Percentage Calculator", 
 description: "Calculate percentages, percentage change, and percentage of a number" 
 },
 fractions: { 
 name: "Fraction Calculator", 
 description: "Add, subtract, multiply, and divide fractions with step-by-step solutions" 
 },
 ratios_proportions: { 
 name: "Ratios & Proportions", 
 description: "Solve ratio and proportion problems with cross-multiplication" 
 }
 }
 },
 algebra: {
 name: "Algebra",
 description: "Equation solvers, factoring, and algebraic operations",
 calculators: {
 linear_equations: { 
 name: "Linear Equation Solver", 
 description: "Solve linear equations with one or multiple variables" 
 },
 quadratic_formula: { 
 name: "Quadratic Formula", 
 description: "Solve quadratic equations using the quadratic formula" 
 },
 logarithms: { 
 name: "Logarithm Calculator", 
 description: "Calculate natural logarithms, common logarithms, and custom bases" 
 }
 }
 },
 geometry: {
 name: "Geometry",
 description: "Area, volume, perimeter, and geometric calculations",
 calculators: {
 circle_area: { 
 name: "Circle Calculator", 
 description: "Calculate circle area, circumference, and diameter from radius" 
 },
 triangle_area: { 
 name: "Triangle Calculator", 
 description: "Calculate triangle area, perimeter, and angles using various methods" 
 },
 rectangle_area: { 
 name: "Rectangle Calculator", 
 description: "Calculate rectangle area, perimeter, and diagonal measurements" 
 },
 sphere_volume: { 
 name: "Sphere Calculator", 
 description: "Calculate sphere volume, surface area, and radius relationships" 
 },
 cylinder_volume: { 
 name: "Cylinder Calculator", 
 description: "Calculate cylinder volume, surface area, and lateral area" 
 }
 }
 }
 }
 },
 health_fitness: {
 name: "Health & Fitness",
 description: "Health metrics, nutrition, fitness, and wellness calculators",
 subcategories: {
 body_metrics: {
 name: "Body Metrics",
 description: "BMI, BMR, body fat percentage, and other body measurements",
 calculators: {
 bmi: { 
 name: "BMI Calculator", 
 description: "Calculate Body Mass Index and determine healthy weight categories" 
 },
 bmr: { 
 name: "BMR Calculator", 
 description: "Calculate Basal Metabolic Rate for daily calorie requirements" 
 },
 body_fat: { 
 name: "Body Fat Percentage", 
 description: "Estimate body fat percentage using various measurement methods" 
 },
 ideal_weight: { 
 name: "Ideal Weight Calculator", 
 description: "Calculate ideal weight range based on height and body frame" 
 }
 }
 },
 nutrition: {
 name: "Nutrition & Diet",
 description: "Calorie counting, macronutrient tracking, and diet planning tools",
 calculators: {
 calorie_counter: { 
 name: "Calorie Counter", 
 description: "Track daily calorie intake and plan meals for weight goals" 
 },
 macronutrient: { 
 name: "Macronutrient Calculator", 
 description: "Calculate optimal protein, carbohydrate, and fat ratios" 
 },
 water_intake: { 
 name: "Water Intake Calculator", 
 description: "Calculate daily water requirements based on activity and climate" 
 }
 }
 }
 }
 }
 }
};

// Translation function
async function translateText(text, targetLanguage) {
 try {
 const response = await openai.chat.completions.create({
 model: "gpt-4",
 messages: [
 {
 role: "system",
 content: `You are a professional translator specializing in financial, mathematical, and technical terminology. Translate the following text to ${targetLanguage} while maintaining accuracy and professional tone. For calculator names and technical terms, use industry-standard translations.`
 },
 {
 role: "user",
 content: text
 }
 ],
 temperature: 0.3,
 max_tokens: 500
 });

 return response.choices[0].message.content.trim();
 } catch (error) {
 console.error(`Translation error for "${text}":`, error.message);
 return text; // Return original text if translation fails
 }
}

// Recursive function to translate nested objects
async function translateObject(obj, targetLanguage, path = '') {
 const translated = {};
 
 for (const [key, value] of Object.entries(obj)) {
 const currentPath = path ? `${path}.${key}` : key;
 console.log(`Translating ${currentPath}...`);
 
 if (typeof value === 'string') {
 translated[key] = await translateText(value, targetLanguage);
 // Add small delay to respect API rate limits
 await new Promise(resolve => setTimeout(resolve, 100));
 } else if (typeof value === 'object' && value !== null) {
 translated[key] = await translateObject(value, targetLanguage, currentPath);
 } else {
 translated[key] = value;
 }
 }
 
 return translated;
}

// Main translation function
async function translateCategories() {
 const languages = [
 { code: 'it', name: 'Italian' },
 { code: 'fr', name: 'French' },
 { code: 'es', name: 'Spanish' }
 ];

 const results = {
 en: categoriesStructure.en
 };

 for (const language of languages) {
 console.log(`\n🌍 Starting translation to ${language.name}...`);
 
 try {
 results[language.code] = await translateObject(
 categoriesStructure.en, 
 language.name
 );
 
 console.log(`✅ ${language.name} translation completed!`);
 
 // Save individual language file
 await fs.writeFile(
 `categories_${language.code}.json`,
 JSON.stringify(results[language.code], null, 2),
 'utf8'
 );
 
 } catch (error) {
 console.error(`❌ Error translating to ${language.name}:`, error.message);
 }
 }

 // Save complete multilingual file
 await fs.writeFile(
 'categories_multilingual.json',
 JSON.stringify(results, null, 2),
 'utf8'
 );

 console.log('\n🎉 Translation process completed!');
 console.log('Files generated:');
 console.log('- categories_multilingual.json (all languages)');
 console.log('- categories_it.json (Italian)');
 console.log('- categories_fr.json (French)');
 console.log('- categories_es.json (Spanish)');
}

// Usage examples and utility functions
const generateReactComponent = (translations) => {
 return `
// Auto-generated translations for SocalSolver.com
export const categoryTranslations = ${JSON.stringify(translations, null, 2)};

// Hook for getting translated category data
export const useCategoryTranslations = (language = 'en') => {
 return categoryTranslations[language] || categoryTranslations.en;
};

// Utility function to get translated text with fallback
export const getTranslatedText = (path, language = 'en') => {
 const keys = path.split('.');
 let current = categoryTranslations[language] || categoryTranslations.en;
 
 for (const key of keys) {
 current = current?.[key];
 if (!current) break;
 }
 
 return current || path;
};
`;
};

// Generate React component file
async function generateTranslationComponent() {
 try {
 const translations = JSON.parse(
 await fs.readFile('categories_multilingual.json', 'utf8')
 );
 
 const componentCode = generateReactComponent(translations);
 
 await fs.writeFile(
 'CategoryTranslations.js',
 componentCode,
 'utf8'
 );
 
 console.log('✅ React component generated: CategoryTranslations.js');
 } catch (error) {
 console.error('❌ Error generating React component:', error.message);
 }
}

// CLI interface
async function main() {
 const args = process.argv.slice(2);
 
 if (args.includes('--help') || args.includes('-h')) {
 console.log(`
🌍 SocalSolver Translation Script

Usage:
 node translation-script.js [options]

Options:
 --translate Run full translation process
 --component Generate React component from existing translations
 --help, -h Show this help message

Environment Variables:
 OPENAI_API_KEY Your OpenAI API key (required)

Examples:
 node translation-script.js --translate
 node translation-script.js --component
`);
 return;
 }

 if (!process.env.OPENAI_API_KEY) {
 console.error('❌ Error: OPENAI_API_KEY environment variable is required');
 console.log('Set it with: export OPENAI_API_KEY="your-api-key-here"');
 return;
 }

 if (args.includes('--translate')) {
 await translateCategories();
 }
 
 if (args.includes('--component')) {
 await generateTranslationComponent();
 }
 
 if (args.length === 0) {
 console.log('No options specified. Use --help for usage information.');
 }
}

// Export functions for use as module
export {
 translateCategories,
 translateText,
 generateTranslationComponent,
 categoriesStructure
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
 main().catch(console.error);
}