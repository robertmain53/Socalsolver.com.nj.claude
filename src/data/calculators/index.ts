import { CalculatorConfig } from '@/types/calculator';
import { compoundInterestConfig } from './compound-interest';
import { loanConfig } from './loan';
import { bmiConfig } from './bmi';

export const calculatorRegistry: Record<string, CalculatorConfig> = {
  'compound-interest': compoundInterestConfig,
  'loan': loanConfig,
  'bmi': bmiConfig
};

export const getCalculatorConfig = (id: string): CalculatorConfig | null => {
  return calculatorRegistry[id] || null;
};

export const getAllCalculators = (): CalculatorConfig[] => {
  return Object.values(calculatorRegistry);
};

export const getCalculatorsByCategory = (category: string): CalculatorConfig[] => {
  return Object.values(calculatorRegistry).filter(
    config => config.category === category
  );
};

export { compoundInterestConfig, loanConfig, bmiConfig };
