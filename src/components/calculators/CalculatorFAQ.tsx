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
