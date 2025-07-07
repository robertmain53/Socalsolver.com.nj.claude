import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Formula {
  name: string;
  label: string;
  unit?: string;
}

interface CalculatorConfig {
  formulas: Formula[];
}

interface Props {
  config: CalculatorConfig;
  results: Record<string, any>;
  inputs: Record<string, any>;
}

export function CalculatorResult({ config, results }: Props) {
  const formatValue = (value: any, unit?: string) => {
    if (typeof value === 'number') {
      const formatted = value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      if (unit === 'currency') {
        return `$${formatted}`;
      } else if (unit === 'percentage') {
        return `${formatted}%`;
      } else if (unit) {
        return `${formatted} ${unit}`;
      }
      return formatted;
    }
    return value;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {config.formulas.map((formula) => (
            <div key={formula.name} className="border-b border-gray-200 pb-3 last:border-b-0">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{formula.label}</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatValue(results[formula.name], formula.unit)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
