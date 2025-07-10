'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Variable {
 name: string;
 label: string;
 type: string;
 required?: boolean;
 defaultValue?: any;
 min?: number;
 max?: number;
 unit?: string;
 options?: Array<{ value: any; label: string }>;
}

interface CalculatorConfig {
 title: string;
 variables: Variable[];
 autoCalculate?: boolean;
}

interface Props {
 config: CalculatorConfig;
 inputs: Record<string, any>;
 errors: Record<string, string>;
 onChange: (inputs: Record<string, any>) => void;
 onCalculate: () => void;
}

export function CalculatorForm({ config, inputs, errors, onChange, onCalculate }: Props) {
 const handleInputChange = (name: string, value: any) => {
 onChange({
 ...inputs,
 [name]: value,
 });
 };

 return (
 <Card>
 <CardHeader>
 <CardTitle>Calculator Inputs</CardTitle>
 </CardHeader>
 <CardContent>
 <div className="space-y-4">
 {config.variables.map((variable) => (
 <div key={variable.name}>
 {variable.type === 'select' ? (
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">
 {variable.label}
 </label>
 <select
 value={inputs[variable.name] || ''}
 onChange={(e) => handleInputChange(variable.name, e.target.value)}
 className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
 >
 <option value="">Select...</option>
 {variable.options?.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 </div>
 ) : (
 <Input
 label={variable.label}
 type={variable.type}
 value={inputs[variable.name] || ''}
 onChange={(e) => handleInputChange(variable.name, e.target.value)}
 error={errors[variable.name]}
 min={variable.min}
 max={variable.max}
 required={variable.required}
 />
 )}
 </div>
 ))}
 
 {!config.autoCalculate && (
 <Button onClick={onCalculate} className="w-full">
 Calculate
 </Button>
 )}
 </div>
 </CardContent>
 </Card>
 );
}
