import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
 if (req.method !== 'POST') {
 res.setHeader('Allow', ['POST']);
 return res.status(405).end(`Method ${req.method} Not Allowed`);
 }

 const { calculatorId, inputs } = req.body;

 if (!calculatorId || !inputs) {
 return res.status(400).json({
 error: 'Missing required fields',
 required: ['calculatorId', 'inputs']
 });
 }

 try {
 let result;

 switch (calculatorId) {
 case 'mortgage':
 result = calculateMortgage(inputs);
 break;
 case 'loan':
 result = calculateLoan(inputs);
 break;
 case 'bmi':
 result = calculateBMI(inputs);
 break;
 default:
 return res.status(404).json({
 error: 'Calculator not found',
 calculatorId
 });
 }

 res.status(200).json({
 calculatorId,
 inputs,
 result,
 timestamp: new Date().toISOString()
 });

 } catch (error) {
 res.status(400).json({
 error: 'Calculation failed',
 details: error.message
 });
 }
}

function calculateMortgage(inputs: any) {
 const { principal, rate, term, downPayment = 0 } = inputs;
 
 if (!principal || !rate || !term) {
 throw new Error('Missing required inputs: principal, rate, term');
 }

 const loanAmount = principal - downPayment;
 const monthlyRate = rate / 100 / 12;
 const numberOfPayments = term * 12;

 const monthlyPayment = loanAmount * 
 (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
 (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

 const totalPaid = monthlyPayment * numberOfPayments;
 const totalInterest = totalPaid - loanAmount;

 return {
 monthlyPayment: Math.round(monthlyPayment * 100) / 100,
 totalPaid: Math.round(totalPaid * 100) / 100,
 totalInterest: Math.round(totalInterest * 100) / 100,
 loanAmount: loanAmount
 };
}

function calculateLoan(inputs: any) {
 const { amount, rate, term } = inputs;
 
 if (!amount || !rate || !term) {
 throw new Error('Missing required inputs: amount, rate, term');
 }

 const monthlyRate = rate / 100 / 12;
 const numberOfPayments = term * 12;

 const monthlyPayment = amount * 
 (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
 (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

 const totalPaid = monthlyPayment * numberOfPayments;
 const totalInterest = totalPaid - amount;

 return {
 monthlyPayment: Math.round(monthlyPayment * 100) / 100,
 totalPaid: Math.round(totalPaid * 100) / 100,
 totalInterest: Math.round(totalInterest * 100) / 100
 };
}

function calculateBMI(inputs: any) {
 const { weight, height } = inputs;
 
 if (!weight || !height) {
 throw new Error('Missing required inputs: weight, height');
 }

 const bmi = (weight * 703) / (height * height);
 
 let category;
 if (bmi < 18.5) {
 category = 'Underweight';
 } else if (bmi < 25) {
 category = 'Normal weight';
 } else if (bmi < 30) {
 category = 'Overweight';
 } else {
 category = 'Obese';
 }

 return {
 bmi: Math.round(bmi * 100) / 100,
 category
 };
}
