import { NextApiRequest, NextApiResponse } from 'next';

// Sample calculator data
const sampleCalculators = [
 {
 id: 'mortgage',
 title: 'Mortgage Calculator',
 description: 'Calculate monthly mortgage payments',
 category: 'finance',
 inputs: [
 { id: 'principal', label: 'Loan Amount', type: 'number', required: true },
 { id: 'rate', label: 'Interest Rate (%)', type: 'number', required: true },
 { id: 'term', label: 'Loan Term (years)', type: 'number', required: true }
 ]
 },
 {
 id: 'loan',
 title: 'Loan Calculator',
 description: 'Calculate loan payments and total interest',
 category: 'finance',
 inputs: [
 { id: 'amount', label: 'Loan Amount', type: 'number', required: true },
 { id: 'rate', label: 'Interest Rate (%)', type: 'number', required: true },
 { id: 'term', label: 'Loan Term (years)', type: 'number', required: true }
 ]
 },
 {
 id: 'bmi',
 title: 'BMI Calculator',
 description: 'Calculate Body Mass Index',
 category: 'health',
 inputs: [
 { id: 'weight', label: 'Weight (lbs)', type: 'number', required: true },
 { id: 'height', label: 'Height (inches)', type: 'number', required: true }
 ]
 }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
 const { method, query } = req;

 switch (method) {
 case 'GET':
 // Handle calculator listing
 const { category, search, page = 1, limit = 20 } = query;
 
 let filteredCalculators = sampleCalculators;
 
 // Filter by category
 if (category) {
 filteredCalculators = filteredCalculators.filter(calc => 
 calc.category === category
 );
 }
 
 // Filter by search term
 if (search) {
 const searchTerm = search.toString().toLowerCase();
 filteredCalculators = filteredCalculators.filter(calc =>
 calc.title.toLowerCase().includes(searchTerm) ||
 calc.description.toLowerCase().includes(searchTerm)
 );
 }
 
 // Simple pagination
 const pageNum = parseInt(page.toString());
 const limitNum = parseInt(limit.toString());
 const startIndex = (pageNum - 1) * limitNum;
 const endIndex = startIndex + limitNum;
 
 const paginatedCalculators = filteredCalculators.slice(startIndex, endIndex);
 
 res.status(200).json({
 calculators: paginatedCalculators,
 pagination: {
 page: pageNum,
 limit: limitNum,
 total: filteredCalculators.length,
 pages: Math.ceil(filteredCalculators.length / limitNum)
 }
 });
 break;

 default:
 res.setHeader('Allow', ['GET']);
 res.status(405).end(`Method ${method} Not Allowed`);
 }
}
