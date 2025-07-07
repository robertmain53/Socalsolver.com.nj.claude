// Complete calculator registry with all required fields
export interface CalculatorConfig {
  id: string;
  title: string;
  description: string;
  category: string;
  variables: any[];
  formulas: any[];
  autoCalculate?: boolean;
  featured?: boolean;
  trending?: boolean;
  tags?: string[];
  lastUpdated: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    useCase: string[];
    relatedTopics: string[];
  };
  explanations?: {
    howItWorks?: string[];
    tips?: string[];
    examples?: Array<{
      scenario: string;
      inputs: Record<string, any>;
      explanation: string;
    }>;
  };
}

// Complete mock calculators with all required fields
const mockCalculators: CalculatorConfig[] = [
  {
    id: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'Calculate compound interest with monthly contributions and compare different compounding frequencies.',
    category: 'finance',
    featured: true,
    trending: true,
    tags: ['investment', 'savings', 'retirement', 'interest'],
    lastUpdated: '2025-01-15',
    autoCalculate: true,
    variables: [
      {
        name: 'principal',
        label: 'Initial Investment',
        type: 'number',
        required: true,
        min: 0,
        defaultValue: 10000,
        unit: 'currency',
        description: 'The initial amount of money invested',
      },
      {
        name: 'rate',
        label: 'Annual Interest Rate',
        type: 'number',
        required: true,
        min: 0,
        max: 50,
        defaultValue: 7,
        unit: 'percentage',
        description: 'The yearly interest rate (as a percentage)',
      },
      {
        name: 'time',
        label: 'Investment Period',
        type: 'number',
        required: true,
        min: 0,
        max: 100,
        defaultValue: 20,
        unit: 'years',
        description: 'How long you plan to invest',
      },
      {
        name: 'contribution',
        label: 'Monthly Contribution',
        type: 'number',
        required: false,
        min: 0,
        defaultValue: 500,
        unit: 'currency',
        description: 'Additional monthly investment amount',
      },
    ],
    formulas: [
      {
        name: 'finalAmount',
        label: 'Final Amount',
        expression: 'principal * (1 + rate/100)^time + contribution * 12 * time',
        unit: 'currency',
        description: 'Total amount after compound growth',
      },
      {
        name: 'totalContributions',
        label: 'Total Contributions',
        expression: 'principal + contribution * 12 * time',
        unit: 'currency',
        description: 'Sum of all money you put in',
      },
      {
        name: 'totalInterest',
        label: 'Total Interest Earned',
        expression: 'finalAmount - totalContributions',
        unit: 'currency',
        description: 'Money earned from compound interest',
      },
    ],
    seo: {
      title: 'Compound Interest Calculator with Monthly Contributions',
      description: 'Calculate compound interest growth with regular monthly contributions. See how your investments grow over time with our free, accurate compound interest calculator.',
      keywords: [
        'compound interest calculator',
        'investment calculator',
        'savings calculator',
        'retirement calculator',
        'monthly contribution calculator',
        'investment growth',
        'financial planning',
      ],
      category: 'finance',
      difficulty: 'beginner',
      useCase: [
        'retirement planning',
        'investment analysis',
        'savings goals',
        'education funding',
        'emergency fund planning',
      ],
      relatedTopics: [
        'simple interest',
        'annuity calculations',
        'retirement planning',
        'investment returns',
        'time value of money',
      ],
    },
    explanations: {
      howItWorks: [
        'Compound interest is the process where your investment earnings generate their own earnings.',
        'Unlike simple interest, compound interest calculates returns on both your original investment and previously earned interest.',
        'Regular monthly contributions significantly boost your final returns through dollar-cost averaging.',
      ],
      tips: [
        'Start investing early to maximize the power of compounding',
        'Consider higher-frequency compounding when possible',
        'Regular contributions can dramatically increase your returns',
        'Even small amounts invested consistently can grow substantially',
      ],
      examples: [
        {
          scenario: 'Conservative Retirement Savings',
          inputs: { principal: 10000, rate: 6, time: 30, contribution: 300 },
          explanation: 'A moderate approach with monthly contributions for long-term retirement planning.',
        },
        {
          scenario: 'Aggressive Growth Strategy',
          inputs: { principal: 5000, rate: 10, time: 25, contribution: 800 },
          explanation: 'Higher risk, higher reward approach with substantial monthly investments.',
        },
      ],
    },
  },
  {
    id: 'loan-payment',
    title: 'Loan Payment Calculator',
    description: 'Calculate monthly loan payments, total interest, and amortization schedules for any loan.',
    category: 'finance',
    featured: true,
    tags: ['mortgage', 'auto loan', 'personal loan', 'debt'],
    lastUpdated: '2025-01-15',
    autoCalculate: true,
    variables: [
      {
        name: 'loanAmount',
        label: 'Loan Amount',
        type: 'number',
        required: true,
        min: 100,
        defaultValue: 250000,
        unit: 'currency',
        description: 'Total amount you want to borrow',
      },
      {
        name: 'interestRate',
        label: 'Annual Interest Rate',
        type: 'number',
        required: true,
        min: 0,
        max: 30,
        defaultValue: 6.5,
        unit: 'percentage',
        description: 'Yearly interest rate offered by lender',
      },
      {
        name: 'loanTerm',
        label: 'Loan Term',
        type: 'number',
        required: true,
        min: 1,
        max: 50,
        defaultValue: 30,
        unit: 'years',
        description: 'Length of time to repay the loan',
      },
    ],
    formulas: [
      {
        name: 'monthlyPayment',
        label: 'Monthly Payment',
        expression: 'loanAmount * (interestRate/100/12 * (1 + interestRate/100/12)^(loanTerm*12)) / ((1 + interestRate/100/12)^(loanTerm*12) - 1)',
        unit: 'currency',
        description: 'Required monthly payment (principal + interest)',
      },
      {
        name: 'totalPayments',
        label: 'Total of Payments',
        expression: 'monthlyPayment * loanTerm * 12',
        unit: 'currency',
        description: 'Total amount paid over the life of the loan',
      },
      {
        name: 'totalInterest',
        label: 'Total Interest Paid',
        expression: 'totalPayments - loanAmount',
        unit: 'currency',
        description: 'Total interest cost over the loan term',
      },
    ],
    seo: {
      title: 'Loan Payment Calculator - Monthly Payment & Interest Calculator',
      description: 'Calculate monthly loan payments, total interest, and see how extra payments can save you money. Free loan calculator for mortgages, auto loans, and personal loans.',
      keywords: [
        'loan payment calculator',
        'monthly payment calculator',
        'mortgage calculator',
        'auto loan calculator',
        'personal loan calculator',
        'loan interest calculator',
      ],
      category: 'finance',
      difficulty: 'beginner',
      useCase: [
        'mortgage planning',
        'auto loan comparison',
        'personal loan analysis',
        'debt consolidation',
        'refinancing decisions',
      ],
      relatedTopics: [
        'amortization schedules',
        'loan comparison',
        'debt management',
        'refinancing',
        'payment strategies',
      ],
    },
    explanations: {
      howItWorks: [
        'Loan payments consist of principal (loan amount) and interest charges.',
        'Early payments go mostly toward interest, while later payments go toward principal.',
        'Shorter loan terms mean higher monthly payments but less total interest.',
      ],
      tips: [
        'Compare total cost, not just monthly payments',
        'Consider the impact of extra payments on total interest',
        'Factor in other costs like insurance and taxes for mortgages',
        'Shop around for the best interest rates',
      ],
    },
  },
  {
    id: 'bmi',
    title: 'BMI Calculator (Body Mass Index)',
    description: 'Calculate your Body Mass Index (BMI) and understand your weight category with health recommendations.',
    category: 'health',
    featured: true,
    tags: ['bmi', 'weight', 'health', 'fitness'],
    lastUpdated: '2025-01-15',
    autoCalculate: true,
    variables: [
      {
        name: 'weight',
        label: 'Weight',
        type: 'number',
        required: true,
        min: 20,
        max: 1000,
        defaultValue: 70,
        unit: 'weight',
        description: 'Your current body weight',
      },
      {
        name: 'height',
        label: 'Height',
        type: 'number',
        required: true,
        min: 50,
        max: 300,
        defaultValue: 175,
        unit: 'length',
        description: 'Your height measurement',
      },
    ],
    formulas: [
      {
        name: 'bmi',
        label: 'Body Mass Index',
        expression: 'weight / (height/100)^2',
        unit: 'decimal',
        description: 'Your BMI value',
      },
      {
        name: 'idealWeightMin',
        label: 'Healthy Weight Range (Min)',
        expression: '18.5 * (height/100)^2',
        unit: 'weight',
        description: 'Minimum healthy weight for your height',
      },
      {
        name: 'idealWeightMax',
        label: 'Healthy Weight Range (Max)',
        expression: '24.9 * (height/100)^2',
        unit: 'weight',
        description: 'Maximum healthy weight for your height',
      },
    ],
    seo: {
      title: 'BMI Calculator - Free Body Mass Index Calculator',
      description: 'Calculate your BMI (Body Mass Index) instantly. Free BMI calculator with weight categories, healthy weight ranges, and health recommendations.',
      keywords: [
        'bmi calculator',
        'body mass index calculator',
        'weight calculator',
        'health calculator',
        'ideal weight calculator',
        'fitness calculator',
      ],
      category: 'health',
      difficulty: 'beginner',
      useCase: [
        'health assessment',
        'weight management',
        'fitness tracking',
        'medical consultation prep',
        'wellness monitoring',
      ],
      relatedTopics: [
        'ideal weight',
        'body composition',
        'health metrics',
        'weight loss',
        'fitness goals',
      ],
    },
    explanations: {
      howItWorks: [
        'BMI is calculated by dividing weight (kg) by height squared (m²).',
        'It provides a simple screening tool for weight categories that may lead to health problems.',
        'BMI categories are: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (≥30).',
      ],
      tips: [
        'BMI is a screening tool, not a diagnostic tool',
        'Muscle weighs more than fat, so athletes may have high BMI but low body fat',
        'Consider waist circumference and other health indicators',
        'Consult healthcare providers for personalized health assessments',
      ],
    },
  },
];

export function getAllCalculators(): CalculatorConfig[] {
  return mockCalculators;
}

export function getCalculatorConfig(id: string): CalculatorConfig | null {
  return mockCalculators.find(calc => calc.id === id) || null;
}

export function getCalculatorsByCategory(category: string): CalculatorConfig[] {
  return mockCalculators.filter(calc => calc.category === category);
}

export function getFeaturedCalculators(): CalculatorConfig[] {
  return mockCalculators.filter(calc => calc.featured);
}

export function getTrendingCalculators(): CalculatorConfig[] {
  return mockCalculators.filter(calc => calc.trending);
}

export function getCategories(): string[] {
  const categories = new Set(mockCalculators.map(calc => calc.category));
  return Array.from(categories).sort();
}

export function searchCalculators(query: string): CalculatorConfig[] {
  const normalizedQuery = query.toLowerCase();
  return mockCalculators.filter(calc => 
    calc.title.toLowerCase().includes(normalizedQuery) ||
    calc.description.toLowerCase().includes(normalizedQuery) ||
    calc.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery)) ||
    calc.seo.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery))
  );
}

export function getRelatedCalculators(calculatorId: string, limit: number = 4): CalculatorConfig[] {
  const calculator = getCalculatorConfig(calculatorId);
  if (!calculator) return [];

  return mockCalculators
    .filter(calc => 
      calc.id !== calculatorId && 
      (calc.category === calculator.category || 
       calc.tags?.some(tag => calculator.tags?.includes(tag)))
    )
    .slice(0, limit);
}
