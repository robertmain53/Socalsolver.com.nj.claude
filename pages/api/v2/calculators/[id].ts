import { NextApiRequest, NextApiResponse } from 'next';

const calculators = {
  mortgage: {
    id: 'mortgage',
    title: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments, total interest, and amortization schedule',
    category: 'finance',
    inputs: [
      { 
        id: 'principal', 
        label: 'Loan Amount ($)', 
        type: 'number', 
        required: true,
        min: 1000,
        max: 10000000,
        help: 'The total amount you want to borrow'
      },
      { 
        id: 'rate', 
        label: 'Interest Rate (%)', 
        type: 'number', 
        required: true,
        min: 0.1,
        max: 30,
        step: 0.01,
        help: 'Annual interest rate as a percentage'
      },
      { 
        id: 'term', 
        label: 'Loan Term (years)', 
        type: 'number', 
        required: true,
        min: 1,
        max: 50,
        help: 'Number of years to repay the loan'
      },
      {
        id: 'downPayment',
        label: 'Down Payment ($)',
        type: 'number',
        required: false,
        min: 0,
        help: 'Optional down payment amount'
      }
    ],
    outputs: [
      { id: 'monthlyPayment', label: 'Monthly Payment', format: 'currency' },
      { id: 'totalPaid', label: 'Total Amount Paid', format: 'currency' },
      { id: 'totalInterest', label: 'Total Interest', format: 'currency' }
    ]
  },
  loan: {
    id: 'loan',
    title: 'Loan Calculator',
    description: 'Calculate loan payments for personal loans, auto loans, and more',
    category: 'finance',
    inputs: [
      { id: 'amount', label: 'Loan Amount ($)', type: 'number', required: true },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', required: true },
      { id: 'term', label: 'Loan Term (years)', type: 'number', required: true }
    ],
    outputs: [
      { id: 'monthlyPayment', label: 'Monthly Payment', format: 'currency' },
      { id: 'totalPaid', label: 'Total Amount Paid', format: 'currency' },
      { id: 'totalInterest', label: 'Total Interest', format: 'currency' }
    ]
  },
  bmi: {
    id: 'bmi',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and health category',
    category: 'health',
    inputs: [
      { id: 'weight', label: 'Weight (lbs)', type: 'number', required: true },
      { id: 'height', label: 'Height (inches)', type: 'number', required: true }
    ],
    outputs: [
      { id: 'bmi', label: 'BMI', format: 'number' },
      { id: 'category', label: 'Health Category', format: 'text' }
    ]
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { id } = query;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const calculator = calculators[id as string];
  
  if (!calculator) {
    return res.status(404).json({
      error: 'Calculator not found',
      availableCalculators: Object.keys(calculators)
    });
  }

  res.status(200).json({ calculator });
}
