'use client';

import React from 'react';
import { CalculatorVariable } from '@/types/calculator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, AlertTriangle } from 'lucide-react';

interface CalculatorFormProps {
  variables: CalculatorVariable[];
  inputs: Record<string, any>;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
  onChange: (name: string, value: any) => void;
  onCalculate?: () => void;
  isCalculating?: boolean;
  embedded?: boolean;
}

export function CalculatorForm({
  variables,
  inputs,
  errors,
  warnings,
  onChange,
  onCalculate,
  isCalculating = false,
  embedded = false
}: CalculatorFormProps) {
  const renderInput = (variable: CalculatorVariable) => {
    const value = inputs[variable.name] || '';
    const hasError = errors[variable.name]?.length > 0;
    const hasWarning = warnings[variable.name]?.length > 0;
    
    const inputProps = {
      id: variable.name,
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        onChange(variable.name, e.target.value),
      placeholder: variable.placeholder,
      className: hasError ? 'border-red-500' : hasWarning ? 'border-yellow-500' : '',
      'aria-describedby': hasError ? `${variable.name}-error` : undefined
    };

    switch (variable.type) {
      case 'number':
        return (
          <Input
            {...inputProps}
            type="number"
            min={variable.validation?.min}
            max={variable.validation?.max}
            step={variable.validation?.step}
          />
        );
        
      case 'percentage':
        return (
          <div className="relative">
            <Input
              {...inputProps}
              type="number"
              min="0"
              max="100"
              step="0.01"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        );
        
      case 'currency':
        return (
          <div className="relative">
            <Input
              {...inputProps}
              type="number"
              min="0"
              step="0.01"
              className="pl-8"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
          </div>
        );
        
      case 'date':
        return (
          <Input
            {...inputProps}
            type="date"
          />
        );
        
      case 'select':
        return (
          <Select 
            value={value} 
            onValueChange={(newValue) => onChange(variable.name, newValue)}
          >
            <SelectTrigger className={hasError ? 'border-red-500' : hasWarning ? 'border-yellow-500' : ''}>
              <SelectValue placeholder={variable.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {variable.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      default:
        return (
          <Input
            {...inputProps}
            type="text"
          />
        );
    }
  };

  return (
    <div className="calculator-form space-y-4">
      <div className={`grid gap-4 ${embedded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {variables.map(variable => (
          <div key={variable.name} className="space-y-2">
            <Label htmlFor={variable.name} className="text-sm font-medium">
              {variable.label}
              {variable.required && <span className="text-red-500 ml-1">*</span>}
              {variable.units && (
                <span className="text-gray-500 ml-1">({variable.units})</span>
              )}
            </Label>
            
            {renderInput(variable)}
            
            {variable.description && (
              <p className="text-xs text-gray-600">
                {variable.description}
              </p>
            )}
            
            {errors[variable.name] && (
              <Alert variant="destructive" className="py-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errors[variable.name].join(', ')}
                </AlertDescription>
              </Alert>
            )}
            
            {warnings[variable.name] && !errors[variable.name] && (
              <Alert className="py-2 border-yellow-500 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm text-yellow-800">
                  {warnings[variable.name].join(', ')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ))}
      </div>
      
      {onCalculate && (
        <div className="pt-4">
          <Button 
            onClick={onCalculate}
            disabled={isCalculating}
            className="w-full md:w-auto"
          >
            <Calculator className="w-4 h-4 mr-2" />
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </Button>
        </div>
      )}
    </div>
  );
}
