import { CalculatorConfig } from '@/types/calculator';

export const bmiConfig: CalculatorConfig = {
  id: 'bmi',
  title: 'BMI Calculator',
  description: 'Calculate your Body Mass Index and health category',
  category: 'health',
  variables: [
    {
      name: 'weight',
      label: 'Weight',
      type: 'number',
      units: 'kg',
      required: true,
      defaultValue: 70,
      description: 'Your weight in kilograms',
      validation: {
        min: 20,
        max: 300
      }
    },
    {
      name: 'height',
      label: 'Height',
      type: 'number',
      units: 'cm',
      required: true,
      defaultValue: 175,
      description: 'Your height in centimeters',
      validation: {
        min: 100,
        max: 250
      }
    }
  ],
  formulas: [
    {
      name: 'bmi',
      label: 'BMI',
      expression: 'weight / ((height/100)^2)',
      resultType: 'decimal',
      description: 'Your Body Mass Index'
    }
  ],
  autoCalculate: true,
  showSteps: false
};
