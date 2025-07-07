'use client';

import { useState, useEffect } from 'react';
import { CalculatorForm } from './CalculatorForm';
import { CalculatorResult } from './CalculatorResult';

interface CalculatorConfig {
  id: string;
  title: string;
  description: string;
  variables: any[];
  formulas: any[];
  autoCalculate?: boolean;
}

interface Props {
  config: CalculatorConfig;
}

export function CalculatorEngine({ config }: Props) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize default values
  useEffect(() => {
    const defaultInputs: Record<string, any> = {};
    config.variables.forEach(variable => {
      if (variable.defaultValue !== undefined) {
        defaultInputs[variable.name] = variable.defaultValue;
      }
    });
    setInputs(defaultInputs);
  }, [config]);

  // Auto-calculate when inputs change
  useEffect(() => {
    if (config.autoCalculate && Object.keys(inputs).length > 0) {
      calculateResults();
    }
  }, [inputs, config]);

  const calculateResults = () => {
    try {
      const newResults: Record<string, any> = {};
      const newErrors: Record<string, string> = {};

      // Basic validation
      config.variables.forEach(variable => {
        if (variable.required && (!inputs[variable.name] || inputs[variable.name] === '')) {
          newErrors[variable.name] = `${variable.label} is required`;
        }
      });

      if (Object.keys(newErrors).length === 0) {
        // Simple calculation - in a real app, this would use the formula evaluator
        config.formulas.forEach(formula => {
          try {
            // For now, just use mock results
            newResults[formula.name] = Math.random() * 1000;
          } catch (error) {
            newErrors[formula.name] = 'Calculation error';
          }
        });
      }

      setResults(newResults);
      setErrors(newErrors);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <CalculatorForm
        config={config}
        inputs={inputs}
        errors={errors}
        onChange={setInputs}
        onCalculate={calculateResults}
      />
      
      {Object.keys(results).length > 0 && (
        <CalculatorResult
          config={config}
          results={results}
          inputs={inputs}
        />
      )}
    </div>
  );
}
