import { CalculatorSEO } from '@/lib/seo';
import { compoundInterestCalculator } from '@/data/calculators/compound-interest';
import { loanPaymentCalculator } from '@/data/calculators/loan-payment';
import { bmiCalculator } from '@/data/calculators/bmi';

const calculators: CalculatorSEO[] = [
  compoundInterestCalculator,
  loanPaymentCalculator,
  bmiCalculator,
];

export function getCalculatorConfig(id: string): CalculatorSEO | null {
  return calculators.find(calc => calc.id === id) || null;
}

export function getAllCalculators(): CalculatorSEO[] {
  return [...calculators];
}

export function getCalculatorsByCategory(category: string): CalculatorSEO[] {
  return calculators.filter(calc => calc.category === category);
}

export function getFeaturedCalculators(): CalculatorSEO[] {
  return calculators.filter(calc => calc.featured);
}

export function getTrendingCalculators(): CalculatorSEO[] {
  return calculators.filter(calc => calc.trending);
}

export function searchCalculators(query: string): CalculatorSEO[] {
  const normalizedQuery = query.toLowerCase();
  
  return calculators.filter(calc => 
    calc.title.toLowerCase().includes(normalizedQuery) ||
    calc.description.toLowerCase().includes(normalizedQuery) ||
    calc.seo.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery)) ||
    calc.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
    calc.seo.category.toLowerCase().includes(normalizedQuery)
  );
}

export function getCategories(): string[] {
  const categories = new Set(calculators.map(calc => calc.category));
  return Array.from(categories).sort();
}

export function getRelatedCalculators(calculatorId: string, limit: number = 4): CalculatorSEO[] {
  const calculator = getCalculatorConfig(calculatorId);
  if (!calculator) return [];

  return calculators
    .filter(calc => 
      calc.id !== calculatorId && 
      (calc.category === calculator.category || 
       calc.tags?.some(tag => calculator.tags?.includes(tag)))
    )
    .slice(0, limit);
}
