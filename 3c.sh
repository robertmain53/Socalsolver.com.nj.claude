#!/bin/bash

# Calculator Platform - Part 3B: Dynamic Calculator Pages & Enhanced Configs
# Creates individual calculator pages with full SEO optimization and related calculators

echo "🚀 Building Calculator Platform - Part 3B: Dynamic Calculator Pages..."

# Enhanced calculator configurations with SEO data
cat > src/data/calculators/compound-interest.ts << 'EOF'
import { CalculatorSEO } from '@/lib/seo';

export const compoundInterestCalculator: CalculatorSEO = {
  id: 'compound-interest',
  title: 'Compound Interest Calculator',
  description: 'Calculate compound interest with monthly contributions and compare different compounding frequencies.',
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
    {
      name: 'frequency',
      label: 'Compounding Frequency',
      type: 'select',
      required: true,
      defaultValue: 12,
      options: [
        { value: 1, label: 'Annually' },
        { value: 4, label: 'Quarterly' },
        { value: 12, label: 'Monthly' },
        { value: 365, label: 'Daily' },
      ],
      description: 'How often interest is compounded',
    },
  ],
  formulas: [
    {
      name: 'finalAmount',
      label: 'Final Amount',
      expression: 'principal * (1 + rate/100/frequency)^(frequency*time) + contribution * (((1 + rate/100/frequency)^(frequency*time) - 1) / (rate/100/frequency)) * 12',
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
    {
      name: 'effectiveRate',
      label: 'Effective Annual Rate',
      expression: '((finalAmount / totalContributions)^(1/time) - 1) * 100',
      unit: 'percentage',
      description: 'Actual yearly return including contributions',
    },
  ],
  autoCalculate: true,
  category: 'finance',
  tags: ['investment', 'savings', 'retirement', 'interest'],
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
      'compound growth',
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
  lastUpdated: '2025-01-15',
  featured: true,
  trending: true,
  explanations: {
    howItWorks: [
      'Compound interest is the process where your investment earnings generate their own earnings.',
      'Unlike simple interest, compound interest calculates returns on both your original investment and previously earned interest.',
      'The more frequently interest compounds, the more you earn over time.',
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
        inputs: { principal: 10000, rate: 6, time: 30, contribution: 300, frequency: 12 },
        explanation: 'A moderate approach with monthly contributions for long-term retirement planning.',
      },
      {
        scenario: 'Aggressive Growth Strategy',
        inputs: { principal: 5000, rate: 10, time: 25, contribution: 800, frequency: 12 },
        explanation: 'Higher risk, higher reward approach with substantial monthly investments.',
      },
    ],
  },
};
EOF

cat > src/data/calculators/loan-payment.ts << 'EOF'
import { CalculatorSEO } from '@/lib/seo';

export const loanPaymentCalculator: CalculatorSEO = {
  id: 'loan-payment',
  title: 'Loan Payment Calculator',
  description: 'Calculate monthly loan payments, total interest, and amortization schedules for any loan.',
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
    {
      name: 'extraPayment',
      label: 'Extra Monthly Payment',
      type: 'number',
      required: false,
      min: 0,
      defaultValue: 0,
      unit: 'currency',
      description: 'Additional amount paid toward principal each month',
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
    {
      name: 'payoffTime',
      label: 'Payoff Time with Extra Payments',
      expression: 'extraPayment > 0 ? log(1 + (monthlyPayment + extraPayment) * 12 / (loanAmount * interestRate/100)) / log(1 + interestRate/100/12) / 12 : loanTerm',
      unit: 'years',
      description: 'Time to pay off loan with extra payments',
    },
  ],
  autoCalculate: true,
  category: 'finance',
  tags: ['mortgage', 'auto loan', 'personal loan', 'debt'],
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
      'amortization calculator',
      'extra payment calculator',
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
  lastUpdated: '2025-01-15',
  featured: true,
  explanations: {
    howItWorks: [
      'Loan payments consist of principal (loan amount) and interest charges.',
      'Early payments go mostly toward interest, while later payments go toward principal.',
      'Extra payments reduce the principal balance faster, saving interest over time.',
      'Shorter loan terms mean higher monthly payments but less total interest.',
    ],
    tips: [
      'Compare total cost, not just monthly payments',
      'Consider the impact of extra payments on total interest',
      'Factor in other costs like insurance and taxes for mortgages',
      'Shop around for the best interest rates',
    ],
    examples: [
      {
        scenario: '30-Year Mortgage',
        inputs: { loanAmount: 400000, interestRate: 7, loanTerm: 30, extraPayment: 0 },
        explanation: 'Standard 30-year fixed-rate mortgage calculation.',
      },
      {
        scenario: 'Accelerated Mortgage Payoff',
        inputs: { loanAmount: 400000, interestRate: 7, loanTerm: 30, extraPayment: 500 },
        explanation: 'Same mortgage with $500 extra monthly payment to reduce term and interest.',
      },
    ],
  },
};
EOF

cat > src/data/calculators/bmi.ts << 'EOF'
import { CalculatorSEO } from '@/lib/seo';

export const bmiCalculator: CalculatorSEO = {
  id: 'bmi',
  title: 'BMI Calculator (Body Mass Index)',
  description: 'Calculate your Body Mass Index (BMI) and understand your weight category with health recommendations.',
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
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      required: false,
      min: 18,
      max: 120,
      defaultValue: 30,
      unit: 'years',
      description: 'Your age (for additional context)',
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: false,
      defaultValue: 'not-specified',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'not-specified', label: 'Prefer not to say' },
      ],
      description: 'Gender (affects healthy weight ranges)',
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
      name: 'category',
      label: 'Weight Category',
      expression: 'bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese"',
      unit: 'text',
      description: 'BMI category classification',
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
  autoCalculate: true,
  category: 'health',
  tags: ['bmi', 'weight', 'health', 'fitness'],
  seo: {
    title: 'BMI Calculator - Free Body Mass Index Calculator',
    description: 'Calculate your BMI (Body Mass Index) instantly. Free BMI calculator with weight categories, healthy weight ranges, and health recommendations.',
    keywords: [
      'bmi calculator',
      'body mass index calculator',
      'weight calculator',
      'health calculator',
      'ideal weight calculator',
      'obesity calculator',
      'fitness calculator',
      'healthy weight',
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
  lastUpdated: '2025-01-15',
  featured: true,
  explanations: {
    howItWorks: [
      'BMI is calculated by dividing weight (kg) by height squared (m²).',
      'It provides a simple screening tool for weight categories that may lead to health problems.',
      'BMI does not directly measure body fat, but research shows it correlates with direct measures of body fat.',
      'BMI categories are: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (≥30).',
    ],
    tips: [
      'BMI is a screening tool, not a diagnostic tool',
      'Muscle weighs more than fat, so athletes may have high BMI but low body fat',
      'Consider waist circumference and other health indicators',
      'Consult healthcare providers for personalized health assessments',
    ],
    examples: [
      {
        scenario: 'Average Adult',
        inputs: { weight: 70, height: 175, age: 30, gender: 'not-specified' },
        explanation: 'Typical BMI calculation for an average-height adult.',
      },
      {
        scenario: 'Athlete Profile',
        inputs: { weight: 85, height: 180, age: 25, gender: 'male' },
        explanation: 'Higher weight due to muscle mass may show higher BMI but still be healthy.',
      },
    ],
  },
};
EOF

# Create dynamic calculator page component
mkdir -p src/app/calculators/\[id\]

cat > src/app/calculators/\[id\]/page.tsx << 'EOF'
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCalculatorConfig, getAllCalculators } from '@/lib/calculator/registry';
import { MetadataGenerator, StructuredDataGenerator } from '@/lib/seo';
import { CalculatorEngine } from '@/components/calculators/CalculatorEngine';
import { RelatedCalculators } from '@/components/calculators/RelatedCalculators';
import { CalculatorBreadcrumbs } from '@/components/calculators/CalculatorBreadcrumbs';
import { CalculatorExplanation } from '@/components/calculators/CalculatorExplanation';
import { CalculatorFAQ } from '@/components/calculators/CalculatorFAQ';

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const calculators = getAllCalculators();
  return calculators.map((calc) => ({
    id: calc.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const calculator = getCalculatorConfig(params.id);
  
  if (!calculator) {
    return {
      title: 'Calculator Not Found',
      description: 'The requested calculator could not be found.',
    };
  }

  return MetadataGenerator.generateCalculatorMetadata(calculator);
}

export default function CalculatorPage({ params }: Props) {
  const calculator = getCalculatorConfig(params.id);
  
  if (!calculator) {
    notFound();
  }

  const allCalculators = getAllCalculators();
  const relatedCalculators = allCalculators
    .filter(calc => 
      calc.id !== calculator.id && 
      (calc.category === calculator.category || 
       calc.tags?.some(tag => calculator.tags?.includes(tag)))
    )
    .slice(0, 4);

  const structuredData = StructuredDataGenerator.generateCalculatorStructuredData(calculator);

  return (
    <>
      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <CalculatorBreadcrumbs calculator={calculator} />

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {calculator.title}
                </h1>
                {calculator.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Featured Calculator
                  </span>
                )}
                {calculator.trending && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                    Trending
                  </span>
                )}
              </div>
              
              <div className="text-right text-sm text-gray-500">
                <div>Category: {calculator.seo.category}</div>
                <div>Difficulty: {calculator.seo.difficulty}</div>
                <div>Updated: {new Date(calculator.lastUpdated).toLocaleDateString()}</div>
              </div>
            </div>
            
            <p className="text-lg text-gray-600 max-w-3xl">
              {calculator.seo.description || calculator.description}
            </p>

            {/* Tags */}
            {calculator.tags && calculator.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {calculator.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Calculator Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <CalculatorEngine config={calculator} />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {calculator.explanations && (
                <CalculatorExplanation explanations={calculator.explanations} />
              )}
              
              <RelatedCalculators 
                calculators={relatedCalculators}
                currentCalculatorId={calculator.id}
              />
            </div>
          </div>

          {/* FAQ Section */}
          {calculator.explanations && (
            <CalculatorFAQ 
              calculator={calculator}
              explanations={calculator.explanations}
            />
          )}

          {/* SEO Content */}
          <section className="mt-12 prose prose-lg max-w-none">
            <h2>About the {calculator.title}</h2>
            <p>
              Our {calculator.title.toLowerCase()} provides accurate, instant calculations 
              for {calculator.seo.useCase.join(', ')}. This free online tool is designed 
              to help you make informed decisions with reliable results.
            </p>
            
            <h3>Key Features</h3>
            <ul>
              <li>Instant, accurate calculations</li>
              <li>Step-by-step explanations</li>
              <li>Mobile-friendly responsive design</li>
              <li>No registration or downloads required</li>
              <li>Completely free to use</li>
            </ul>

            <h3>Use Cases</h3>
            <p>
              This calculator is perfect for {calculator.seo.useCase.join(', ')}, 
              and related {calculator.seo.category} calculations.
            </p>

            <h3>Related Topics</h3>
            <p>
              Learn more about {calculator.seo.relatedTopics.join(', ')} to enhance 
              your understanding of {calculator.seo.category} calculations.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
EOF

# Create supporting components
mkdir -p src/components/calculators

cat > src/components/calculators/CalculatorBreadcrumbs.tsx << 'EOF'
import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';
import { CalculatorSEO } from '@/lib/seo';

interface Props {
  calculator: CalculatorSEO;
}

export function CalculatorBreadcrumbs({ calculator }: Props) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link
              href="/calculators"
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
            >
              Calculators
            </Link>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link
              href={`/calculators/category/${calculator.seo.category}`}
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 capitalize"
            >
              {calculator.seo.category}
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
              {calculator.title}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
}
EOF

cat > src/components/calculators/RelatedCalculators.tsx << 'EOF'
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CalculatorSEO } from '@/lib/seo';

interface Props {
  calculators: CalculatorSEO[];
  currentCalculatorId: string;
}

export function RelatedCalculators({ calculators, currentCalculatorId }: Props) {
  if (calculators.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Calculators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {calculators.map((calc) => (
            <Link
              key={calc.id}
              href={`/calculators/${calc.id}`}
              className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-gray-900 mb-1">
                {calc.title}
              </div>
              <div className="text-sm text-gray-600 line-clamp-2">
                {calc.seo.description || calc.description}
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
                  {calc.seo.category}
                </span>
                {calc.featured && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded ml-2">
                    Featured
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
EOF

cat > src/components/calculators/CalculatorExplanation.tsx << 'EOF'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ExplanationData {
  howItWorks?: string[];
  tips?: string[];
  examples?: Array<{
    scenario: string;
    inputs: Record<string, any>;
    explanation: string;
  }>;
}

interface Props {
  explanations: ExplanationData;
}

export function CalculatorExplanation({ explanations }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">How It Works</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {explanations.howItWorks && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Understanding the Calculation</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {explanations.howItWorks.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {explanations.tips && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Tips & Best Practices</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {explanations.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {explanations.examples && explanations.examples.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Example Scenarios</h4>
            <div className="space-y-3">
              {explanations.examples.map((example, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {example.scenario}
                  </div>
                  <div className="text-xs text-gray-600">
                    {example.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
EOF

cat > src/components/calculators/CalculatorFAQ.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CalculatorSEO } from '@/lib/seo';

interface Props {
  calculator: CalculatorSEO;
  explanations: any;
}

export function CalculatorFAQ({ calculator, explanations }: Props) {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const faqItems = [
    {
      question: `How do I use the ${calculator.title}?`,
      answer: `Simply enter your values in the input fields and our ${calculator.title.toLowerCase()} will automatically calculate the results. All calculations are performed instantly as you type.`,
    },
    {
      question: `Is the ${calculator.title} free to use?`,
      answer: `Yes, our ${calculator.title.toLowerCase()} is completely free to use with no registration required. You can access all features without any limitations.`,
    },
    {
      question: `How accurate are the calculations?`,
      answer: `Our ${calculator.title.toLowerCase()} uses precise mathematical formulas to ensure accurate results. The calculations are performed using industry-standard methods and validated algorithms.`,
    },
    {
      question: `Can I save or share my calculations?`,
      answer: `You can bookmark the page with your current inputs, or copy the URL to share your calculation settings with others. The calculator will remember your inputs in the URL parameters.`,
    },
    {
      question: `What browsers are supported?`,
      answer: `Our calculator works on all modern web browsers including Chrome, Firefox, Safari, and Edge. It's also fully responsive and works great on mobile devices.`,
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {openItems[index] ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openItems[index] && (
                <div className="px-4 pb-3 text-gray-600">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
EOF

# Update registry to include new calculators
cat > src/lib/calculator/registry.ts << 'EOF'
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
EOF

echo "✅ Dynamic Calculator Pages created!"
echo "   📁 src/app/calculators/[id]/"
echo "   ├── page.tsx - Individual calculator pages"
echo "   📁 src/components/calculators/"
echo "   ├── CalculatorBreadcrumbs.tsx - Navigation breadcrumbs"
echo "   ├── RelatedCalculators.tsx - Related calculator suggestions"
echo "   ├── CalculatorExplanation.tsx - How it works explanations"
echo "   └── CalculatorFAQ.tsx - FAQ section"
echo "   📁 src/data/calculators/"
echo "   ├── compound-interest.ts - Enhanced with SEO data"
echo "   ├── loan-payment.ts - Enhanced with SEO data"
echo "   └── bmi.ts - Enhanced with SEO data"
echo ""
echo "🎯 Key Features:"
echo "   • Individual SEO-optimized pages for each calculator"
echo "   • Structured data and rich snippets"
echo "   • Related calculators recommendations"
echo "   • Breadcrumb navigation"
echo "   • FAQ sections for better SEO"
echo "   • Enhanced calculator configs with explanations"