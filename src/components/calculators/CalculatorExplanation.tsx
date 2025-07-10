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
