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
