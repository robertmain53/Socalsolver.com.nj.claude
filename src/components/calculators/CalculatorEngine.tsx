'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorConfig } from '@/types/calculator';
import { formulaEvaluator } from '@/lib/calculator/evaluator';
import { calculatorValidator } from '@/lib/calculator/validator';
import { CalculatorForm } from './CalculatorForm';
import { CalculatorResult } from './CalculatorResult';
import { Card } from '@/components/ui/card';

interface CalculatorEngineProps {
  config: CalculatorConfig;
  className?: string;
  embedded?: boolean;
  onCalculate?: (result: any) => void;
}

export function CalculatorEngine({
  config,
  className = '',
  embedded = false,
  onCalculate
}: CalculatorEngineProps) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [warnings, setWarnings] = useState<Record<string, string[]>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  // Initialize inputs with default values
  useEffect(() => {
    const defaultInputs: Record<string, any> = {};
    config.variables.forEach(variable => {
      if (variable.defaultValue !== undefined) {
        defaultInputs[variable.name] = variable.defaultValue;
      }
    });
    setInputs(defaultInputs);
  }, [config]);

  // Auto-calculate when inputs change (if enabled)
  useEffect(() => {
    if (config.autoCalculate && Object.keys(inputs).length > 0) {
      calculate();
    }
  }, [inputs, config.autoCalculate]);

  const calculate = useMemo(() => {
    return async () => {
      setIsCalculating(true);
      
      try {
        // Validate inputs
        const validation = calculatorValidator.validateInputs(inputs, config.variables);
        setErrors(validation.errors);
        setWarnings(validation.warnings);
        
        if (!validation.isValid) {
          setResults({});
          return;
        }
        
        // Calculate results for each formula
        const newResults: Record<string, any> = {};
        
        for (const formula of config.formulas) {
          const result = formulaEvaluator.evaluate(formula, inputs);
          if (result !== null) {
            newResults[formula.name] = result;
          }
        }
        
        setResults(newResults);
        
        // Call callback if provided
        if (onCalculate) {
          onCalculate(newResults);
        }
        
      } catch (error) {
        console.error('Calculation error:', error);
        setResults({});
      } finally {
        setIsCalculating(false);
      }
    };
  }, [inputs, config, onCalculate]);

  const handleInputChange = (name: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const hasResults = Object.keys(results).length > 0;
  const hasErrors = Object.keys(errors).length > 0;

  if (embedded) {
    return (
      <div className={`calculator-engine ${className}`}>
        <CalculatorForm
          variables={config.variables}
          inputs={inputs}
          errors={errors}
          warnings={warnings}
          onChange={handleInputChange}
          onCalculate={!config.autoCalculate ? calculate : undefined}
          isCalculating={isCalculating}
          embedded
        />
        
        {hasResults && (
          <CalculatorResult
            formulas={config.formulas}
            results={results}
            inputs={inputs}
            embedded
          />
        )}
      </div>
    );
  }

  return (
    <div className={`calculator-engine space-y-6 ${className}`}>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {config.title}
          </h2>
          {config.description && (
            <p className="text-gray-600">
              {config.description}
            </p>
          )}
        </div>

        <CalculatorForm
          variables={config.variables}
          inputs={inputs}
          errors={errors}
          warnings={warnings}
          onChange={handleInputChange}
          onCalculate={!config.autoCalculate ? calculate : undefined}
          isCalculating={isCalculating}
        />
      </Card>

      {(hasResults || hasErrors) && (
        <Card className="p-6">
          <CalculatorResult
            formulas={config.formulas}
            results={results}
            inputs={inputs}
            showSteps={config.showSteps}
          />
        </Card>
      )}
    </div>
  );
}
