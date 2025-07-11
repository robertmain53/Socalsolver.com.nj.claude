import { CalculatorConfig } from '@/types/calculator';

export const loanConfig: CalculatorConfig = {
 id: 'loan',
 title: 'Loan Payment Calculator',
 description: 'Calculate monthly payments and total interest for loans',
 category: 'finance',
 variables: [
 {
 id: 'amount',
 label: 'Loan Amount',
 type: 'currency',
 required: true,
 defaultValue: 200000,
 description: 'The total amount of the loan',
 validation: {
 min: 1000,
 max: 10000000
 }
 },
 {
 id: 'rate',
 label: 'Annual Interest Rate',
 type: 'percentage',
 required: true,
 defaultValue: 3.5,
 description: 'The annual interest rate of the loan',
 validation: {
 min: 0.1,
 max: 30
 }
 },
 {
 id: 'term',
 label: 'Loan Term',
 type: 'number',
 units: 'years',
 required: true,
 defaultValue: 30,
 description: 'The length of the loan in years',
 validation: {
 min: 1,
 max: 50
 }
 }
 ],
 formulas: [
 {
 id: 'monthlyPayment',
 label: 'Monthly Payment',
 expression: '(amount * ((rate/100)/12) * (1 + (rate/100)/12)^(term*12)) / ((1 + (rate/100)/12)^(term*12) - 1)',
 resultType: 'currency',
 description: 'The monthly payment amount'
 },
 {
 id: 'totalPayment',
 label: 'Total Payment',
 expression: '((amount * ((rate/100)/12) * (1 + (rate/100)/12)^(term*12)) / ((1 + (rate/100)/12)^(term*12) - 1)) * term * 12',
 resultType: 'currency',
 description: 'The total amount paid over the life of the loan'
 },
 {
 id: 'totalInterest',
 label: 'Total Interest',
 expression: '(((amount * ((rate/100)/12) * (1 + (rate/100)/12)^(term*12)) / ((1 + (rate/100)/12)^(term*12) - 1)) * term * 12) - amount',
 resultType: 'currency',
 description: 'The total interest paid over the life of the loan'
 }
 ],
 autoCalculate: true,
 showSteps: true
};
