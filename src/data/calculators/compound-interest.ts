import { CalculatorConfig } from '@/types/calculator';

export const compoundInterestConfig: CalculatorConfig = {
  id: 'compound-interest',
  title: 'Compound Interest Calculator',
  description: 'Calculate the future value of your investments with compound interest',
  category: 'finance',
  variables: [
    {
      name: 'principal',
      label: 'Initial Principal',
      type: 'currency',
      required: true,
      defaultValue: 10000,
      description: 'The initial amount of money invested',
      validation: {
        min: 1,
        max: 10000000
      }
    },
    {
      name: 'rate',
      label: 'Annual Interest Rate',
      type: 'percentage',
      required: true,
      defaultValue: 7,
      description: 'The annual interest rate (as a percentage)',
      validation: {
        min: 0.01,
        max: 50
      }
    },
    {
      name: 'time',
      label: 'Time Period',
      type: 'number',
      units: 'years',
      required: true,
      defaultValue: 10,
      description: 'The number of years the money is invested',
      validation: {
        min: 1,
        max: 100
      }
    },
    {
      name: 'frequency',
      label: 'Compounding Frequency',
      type: 'select',
      required: true,
      defaultValue: '12',
      description: 'How often the interest is compounded',
      options: [
        { label: 'Annually', value: '1' },
        { label: 'Semi-annually', value: '2' },
        { label: 'Quarterly', value: '4' },
        { label: 'Monthly', value: '12' },
        { label: 'Daily', value: '365' }
      ]
    }
  ],
  formulas: [
    {
      name: 'futureValue',
      label: 'Future Value',
      expression: 'principal * (1 + (rate/100)/frequency)^(frequency * time)',
      resultType: 'currency',
      description: 'The total amount after compound interest'
    },
    {
      name: 'totalInterest',
      label: 'Total Interest Earned',
      expression: '(principal * (1 + (rate/100)/frequency)^(frequency * time)) - principal',
      resultType: 'currency',
      description: 'The total interest earned over the investment period'
    }
  ],
  autoCalculate: true,
  showSteps: true
};
