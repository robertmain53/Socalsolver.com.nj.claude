#!/bin/bash

# Calculator Platform - Part 2: Calculator Engine & Components Setup
# Builds the modular calculator system with dynamic components and real-time evaluation

set -e

echo "🧮 Setting up Calculator Engine & Components..."

# Install additional dependencies for calculator engine
echo "📦 Installing calculator dependencies..."
npm install --save expr-eval mathjs date-fns
npm install --save-dev @types/expr-eval

# Create calculator library directory structure
echo "📁 Creating calculator library structure..."
mkdir -p src/lib/calculator
mkdir -p src/data/calculators
mkdir -p src/components/calculators

# 1. Core Calculator Engine - Formula Evaluator
echo "⚙️ Creating formula evaluator..."
cat > src/lib/calculator/evaluator.ts << 'EOF'
import { Parser } from 'expr-eval';
import { CalculatorFormula, CalculatorVariable } from '@/types/calculator';

export class FormulaEvaluator {
  private parser: Parser;
  
  constructor() {
    this.parser = new Parser();
  }

  /**
   * Evaluate a formula with given variables
   */
  evaluate(
    formula: CalculatorFormula,
    variables: Record<string, any>
  ): number | string | null {
    try {
      // Convert variables to proper types
      const processedVars = this.processVariables(variables);
      
      // Parse and evaluate the formula
      const expr = this.parser.parse(formula.expression);
      const result = expr.evaluate(processedVars);
      
      // Format result based on formula result type
      return this.formatResult(result, formula.resultType);
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return null;
    }
  }

  /**
   * Get step-by-step calculation breakdown
   */
  getSteps(
    formula: CalculatorFormula,
    variables: Record<string, any>
  ): Array<{ step: string; value: number | string; description?: string }> {
    const steps: Array<{ step: string; value: number | string; description?: string }> = [];
    
    try {
      const processedVars = this.processVariables(variables);
      
      // Add input variables as first steps
      Object.entries(processedVars).forEach(([key, value]) => {
        steps.push({
          step: key,
          value: value,
          description: `Input: ${key}`
        });
      });
      
      // Evaluate main formula
      const expr = this.parser.parse(formula.expression);
      const result = expr.evaluate(processedVars);
      
      steps.push({
        step: formula.expression,
        value: this.formatResult(result, formula.resultType),
        description: formula.description || 'Final calculation'
      });
      
      return steps;
    } catch (error) {
      console.error('Step calculation error:', error);
      return [];
    }
  }

  /**
   * Validate if formula can be evaluated with given variables
   */
  validate(
    formula: CalculatorFormula,
    variables: Record<string, any>
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const processedVars = this.processVariables(variables);
      const expr = this.parser.parse(formula.expression);
      
      // Check if all required variables are present
      const requiredVars = expr.variables();
      const missingVars = requiredVars.filter(v => !(v in processedVars));
      
      if (missingVars.length > 0) {
        errors.push(`Missing variables: ${missingVars.join(', ')}`);
      }
      
      // Try to evaluate
      expr.evaluate(processedVars);
      
    } catch (error) {
      errors.push(`Formula error: ${error.message}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private processVariables(variables: Record<string, any>): Record<string, number> {
    const processed: Record<string, number> = {};
    
    Object.entries(variables).forEach(([key, value]) => {
      if (typeof value === 'number') {
        processed[key] = value;
      } else if (typeof value === 'string') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          processed[key] = numValue;
        }
      }
    });
    
    return processed;
  }

  private formatResult(result: any, resultType?: string): number | string {
    if (typeof result !== 'number') {
      return result;
    }
    
    switch (resultType) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(result);
      case 'percentage':
        return `${(result * 100).toFixed(2)}%`;
      case 'decimal':
        return result.toFixed(2);
      case 'integer':
        return Math.round(result);
      default:
        return result;
    }
  }
}

export const formulaEvaluator = new FormulaEvaluator();
EOF

# 2. Unit Conversion System
echo "🔄 Creating unit conversion system..."
cat > src/lib/calculator/units.ts << 'EOF'
export interface UnitDefinition {
  name: string;
  symbol: string;
  toBase: number; // Conversion factor to base unit
  category: string;
}

export interface UnitCategory {
  name: string;
  baseUnit: string;
  units: UnitDefinition[];
}

export const UNIT_CATEGORIES: Record<string, UnitCategory> = {
  length: {
    name: 'Length',
    baseUnit: 'meter',
    units: [
      { name: 'millimeter', symbol: 'mm', toBase: 0.001, category: 'length' },
      { name: 'centimeter', symbol: 'cm', toBase: 0.01, category: 'length' },
      { name: 'meter', symbol: 'm', toBase: 1, category: 'length' },
      { name: 'kilometer', symbol: 'km', toBase: 1000, category: 'length' },
      { name: 'inch', symbol: 'in', toBase: 0.0254, category: 'length' },
      { name: 'foot', symbol: 'ft', toBase: 0.3048, category: 'length' },
      { name: 'yard', symbol: 'yd', toBase: 0.9144, category: 'length' },
      { name: 'mile', symbol: 'mi', toBase: 1609.344, category: 'length' }
    ]
  },
  weight: {
    name: 'Weight',
    baseUnit: 'kilogram',
    units: [
      { name: 'gram', symbol: 'g', toBase: 0.001, category: 'weight' },
      { name: 'kilogram', symbol: 'kg', toBase: 1, category: 'weight' },
      { name: 'pound', symbol: 'lb', toBase: 0.453592, category: 'weight' },
      { name: 'ounce', symbol: 'oz', toBase: 0.0283495, category: 'weight' },
      { name: 'stone', symbol: 'st', toBase: 6.35029, category: 'weight' }
    ]
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'celsius',
    units: [
      { name: 'celsius', symbol: '°C', toBase: 1, category: 'temperature' },
      { name: 'fahrenheit', symbol: '°F', toBase: 1, category: 'temperature' },
      { name: 'kelvin', symbol: 'K', toBase: 1, category: 'temperature' }
    ]
  },
  currency: {
    name: 'Currency',
    baseUnit: 'USD',
    units: [
      { name: 'USD', symbol: '$', toBase: 1, category: 'currency' },
      { name: 'EUR', symbol: '€', toBase: 0.85, category: 'currency' },
      { name: 'GBP', symbol: '£', toBase: 0.73, category: 'currency' },
      { name: 'JPY', symbol: '¥', toBase: 110, category: 'currency' }
    ]
  }
};

export class UnitConverter {
  /**
   * Convert value from one unit to another
   */
  convert(value: number, fromUnit: string, toUnit: string): number | null {
    const fromDef = this.findUnit(fromUnit);
    const toDef = this.findUnit(toUnit);
    
    if (!fromDef || !toDef || fromDef.category !== toDef.category) {
      return null;
    }
    
    // Special handling for temperature
    if (fromDef.category === 'temperature') {
      return this.convertTemperature(value, fromUnit, toUnit);
    }
    
    // Convert to base unit, then to target unit
    const baseValue = value * fromDef.toBase;
    return baseValue / toDef.toBase;
  }

  /**
   * Get all units for a category
   */
  getUnitsForCategory(category: string): UnitDefinition[] {
    return UNIT_CATEGORIES[category]?.units || [];
  }

  /**
   * Get unit definition by name or symbol
   */
  findUnit(unit: string): UnitDefinition | null {
    for (const category of Object.values(UNIT_CATEGORIES)) {
      const found = category.units.find(
        u => u.name === unit || u.symbol === unit
      );
      if (found) return found;
    }
    return null;
  }

  /**
   * Special temperature conversion handling
   */
  private convertTemperature(value: number, from: string, to: string): number {
    // Convert to Celsius first
    let celsius = value;
    if (from === 'fahrenheit') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'kelvin') {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target
    if (to === 'fahrenheit') {
      return celsius * 9/5 + 32;
    } else if (to === 'kelvin') {
      return celsius + 273.15;
    }
    
    return celsius;
  }
}

export const unitConverter = new UnitConverter();
EOF

# 3. Calculator Validation Engine
echo "✅ Creating validation engine..."
cat > src/lib/calculator/validator.ts << 'EOF'
import { z } from 'zod';
import { CalculatorVariable } from '@/types/calculator';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}

export class CalculatorValidator {
  /**
   * Validate calculator inputs against variable definitions
   */
  validateInputs(
    inputs: Record<string, any>,
    variables: CalculatorVariable[]
  ): ValidationResult {
    const errors: Record<string, string[]> = {};
    const warnings: Record<string, string[]> = {};
    
    variables.forEach(variable => {
      const value = inputs[variable.name];
      const fieldErrors: string[] = [];
      const fieldWarnings: string[] = [];
      
      // Check required fields
      if (variable.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(`${variable.label} is required`);
        return;
      }
      
      // Skip validation if not required and empty
      if (!variable.required && (value === undefined || value === null || value === '')) {
        return;
      }
      
      // Type-specific validation
      switch (variable.type) {
        case 'number':
          this.validateNumber(value, variable, fieldErrors, fieldWarnings);
          break;
        case 'percentage':
          this.validatePercentage(value, variable, fieldErrors, fieldWarnings);
          break;
        case 'currency':
          this.validateCurrency(value, variable, fieldErrors, fieldWarnings);
          break;
        case 'date':
          this.validateDate(value, variable, fieldErrors, fieldWarnings);
          break;
        case 'select':
          this.validateSelect(value, variable, fieldErrors, fieldWarnings);
          break;
      }
      
      if (fieldErrors.length > 0) {
        errors[variable.name] = fieldErrors;
      }
      if (fieldWarnings.length > 0) {
        warnings[variable.name] = fieldWarnings;
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings
    };
  }

  private validateNumber(
    value: any,
    variable: CalculatorVariable,
    errors: string[],
    warnings: string[]
  ): void {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      errors.push(`${variable.label} must be a valid number`);
      return;
    }
    
    // Min/Max validation
    if (variable.validation?.min !== undefined && numValue < variable.validation.min) {
      errors.push(`${variable.label} must be at least ${variable.validation.min}`);
    }
    
    if (variable.validation?.max !== undefined && numValue > variable.validation.max) {
      errors.push(`${variable.label} must be at most ${variable.validation.max}`);
    }
    
    // Step validation
    if (variable.validation?.step && numValue % variable.validation.step !== 0) {
      warnings.push(`${variable.label} should be a multiple of ${variable.validation.step}`);
    }
  }

  private validatePercentage(
    value: any,
    variable: CalculatorVariable,
    errors: string[],
    warnings: string[]
  ): void {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      errors.push(`${variable.label} must be a valid percentage`);
      return;
    }
    
    if (numValue < 0 || numValue > 100) {
      warnings.push(`${variable.label} is typically between 0% and 100%`);
    }
  }

  private validateCurrency(
    value: any,
    variable: CalculatorVariable,
    errors: string[],
    warnings: string[]
  ): void {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      errors.push(`${variable.label} must be a valid amount`);
      return;
    }
    
    if (numValue < 0) {
      warnings.push(`${variable.label} is negative`);
    }
  }

  private validateDate(
    value: any,
    variable: CalculatorVariable,
    errors: string[],
    warnings: string[]
  ): void {
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      errors.push(`${variable.label} must be a valid date`);
      return;
    }
    
    const now = new Date();
    if (date > now) {
      warnings.push(`${variable.label} is in the future`);
    }
  }

  private validateSelect(
    value: any,
    variable: CalculatorVariable,
    errors: string[],
    warnings: string[]
  ): void {
    if (!variable.options) {
      errors.push(`${variable.label} has no available options`);
      return;
    }
    
    const validOptions = variable.options.map(opt => opt.value);
    if (!validOptions.includes(value)) {
      errors.push(`${variable.label} must be one of: ${validOptions.join(', ')}`);
    }
  }
}

export const calculatorValidator = new CalculatorValidator();
EOF

# 4. Main Calculator Engine Component
echo "🧮 Creating main calculator engine..."
cat > src/components/calculators/CalculatorEngine.tsx << 'EOF'
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
EOF

# 5. Calculator Form Component
echo "📝 Creating calculator form..."
cat > src/components/calculators/CalculatorForm.tsx << 'EOF'
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
EOF

# 6. Calculator Result Component
echo "📊 Creating calculator result..."
cat > src/components/calculators/CalculatorResult.tsx << 'EOF'
'use client';

import React, { useState } from 'react';
import { CalculatorFormula } from '@/types/calculator';
import { formulaEvaluator } from '@/lib/calculator/evaluator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, TrendingUp, Copy, Check } from 'lucide-react';

interface CalculatorResultProps {
  formulas: CalculatorFormula[];
  results: Record<string, any>;
  inputs: Record<string, any>;
  showSteps?: boolean;
  embedded?: boolean;
}

export function CalculatorResult({
  formulas,
  results,
  inputs,
  showSteps = false,
  embedded = false
}: CalculatorResultProps) {
  const [expandedSteps, setExpandedSteps] = useState<string | null>(null);
  const [copiedResults, setCopiedResults] = useState<Set<string>>(new Set());

  const toggleSteps = (formulaName: string) => {
    setExpandedSteps(expandedSteps === formulaName ? null : formulaName);
  };

  const copyResult = async (formulaName: string, value: any) => {
    try {
      await navigator.clipboard.writeText(value.toString());
      setCopiedResults(prev => new Set([...prev, formulaName]));
      setTimeout(() => {
        setCopiedResults(prev => {
          const newSet = new Set(prev);
          newSet.delete(formulaName);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy result:', error);
    }
  };

  const getResultIcon = (resultType?: string) => {
    switch (resultType) {
      case 'currency':
        return '💰';
      case 'percentage':
        return '📊';
      case 'date':
        return '📅';
      default:
        return '🔢';
    }
  };

  const getResultColor = (resultType?: string) => {
    switch (resultType) {
      case 'currency':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'percentage':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'date':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (Object.keys(results).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Enter values above to see results</p>
      </div>
    );
  }

  return (
    <div className="calculator-result space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Results
      </h3>
      
      {formulas.map(formula => {
        const result = results[formula.name];
        if (result === undefined || result === null) return null;
        
        const isCopied = copiedResults.has(formula.name);
        const hasSteps = showSteps && !embedded;
        const stepsExpanded = expandedSteps === formula.name;
        
        return (
          <Card key={formula.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {getResultIcon(formula.resultType)}
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {formula.label || formula.name}
                  </h4>
                  {formula.description && (
                    <p className="text-sm text-gray-600">
                      {formula.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={getResultColor(formula.resultType)}
                >
                  {result}
                </Badge>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyResult(formula.name, result)}
                  className="h-8 w-8 p-0"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {hasSteps && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSteps(formula.name)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {stepsExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Hide calculation steps
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show calculation steps
                    </>
                  )}
                </Button>
                
                {stepsExpanded && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">
                      Calculation Steps:
                    </h5>
                    
                    {(() => {
                      const steps = formulaEvaluator.getSteps(formula, inputs);
                      return (
                        <div className="space-y-2">
                          {steps.map((step, index) => (
                            <div 
                              key={index}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-600">
                                {step.description || step.step}
                              </span>
                              <span className="font-mono font-medium">
                                {step.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
EOF

# 7. Embeddable Calculator Widget
echo "🔌 Creating embeddable widget..."
cat > src/components/calculators/CalculatorEmbed.tsx << 'EOF'
'use client';

import React from 'react';
import { CalculatorConfig } from '@/types/calculator';
import { CalculatorEngine } from './CalculatorEngine';

interface CalculatorEmbedProps {
  config: CalculatorConfig;
  theme?: 'light' | 'dark';
  compact?: boolean;
  showTitle?: boolean;
  className?: string;
}

export function CalculatorEmbed({
  config,
  theme = 'light',
  compact = false,
  showTitle = true,
  className = ''
}: CalculatorEmbedProps) {
  const themeClasses = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';
    
  const sizeClasses = compact 
    ? 'p-4 space-y-3' 
    : 'p-6 space-y-4';

  return (
    <div className={`calculator-embed rounded-lg border ${themeClasses} ${sizeClasses} ${className}`}>
      {showTitle && (
        <div className="border-b pb-3 mb-4">
          <h3 className="font-semibold text-lg">
            {config.title}
          </h3>
          {config.description && (
            <p className="text-sm opacity-80 mt-1">
              {config.description}
            </p>
          )}
        </div>
      )}
      
      <CalculatorEngine
        config={config}
        embedded={true}
        className="space-y-3"
      />
      
      <div className="pt-3 border-t text-xs opacity-60 text-center">
        Powered by Calculator Platform
      </div>
    </div>
  );
}
EOF

# 8. Sample Calculator Configurations
echo "📊 Creating sample calculator configs..."

# Compound Interest Calculator
cat > src/data/calculators/compound-interest.ts << 'EOF'
import { CalculatorConfig } from '@/types/calculator';

export const compoundInterestConfig: CalculatorConfig = {
  id: 'compound-interest',
  title: 'Compound Interest Calculator',
  description: 'Calculate the future value of your investments with compound interest',
  category: 'finance',
  variables: [
    {
      name: 'principal',
      label: 'Initial Principal',
      type: 'currency',
      required: true,
      defaultValue: 10000,
      description: 'The initial amount of money invested',
      validation: {
        min: 1,
        max: 10000000
      }
    },
    {
      name: 'rate',
      label: 'Annual Interest Rate',
      type: 'percentage',
      required: true,
      defaultValue: 7,
      description: 'The annual interest rate (as a percentage)',
      validation: {
        min: 0.01,
        max: 50
      }
    },
    {
      name: 'time',
      label: 'Time Period',
      type: 'number',
      units: 'years',
      required: true,
      defaultValue: 10,
      description: 'The number of years the money is invested',
      validation: {
        min: 1,
        max: 100
      }
    },
    {
      name: 'frequency',
      label: 'Compounding Frequency',
      type: 'select',
      required: true,
      defaultValue: '12',
      description: 'How often the interest is compounded',
      options: [
        { label: 'Annually', value: '1' },
        { label: 'Semi-annually', value: '2' },
        { label: 'Quarterly', value: '4' },
        { label: 'Monthly', value: '12' },
        { label: 'Daily', value: '365' }
      ]
    }
  ],
  formulas: [
    {
      name: 'futureValue',
      label: 'Future Value',
      expression: 'principal * (1 + (rate/100)/frequency)^(frequency * time)',
      resultType: 'currency',
      description: 'The total amount after compound interest'
    },
    {
      name: 'totalInterest',
      label: 'Total Interest Earned',
      expression: '(principal * (1 + (rate/100)/frequency)^(frequency * time)) - principal',
      resultType: 'currency',
      description: 'The total interest earned over the investment period'
    }
  ],
  autoCalculate: true,
  showSteps: true
};
EOF

# Loan Calculator
cat > src/data/calculators/loan.ts << 'EOF'
import { CalculatorConfig } from '@/types/calculator';

export const loanConfig: CalculatorConfig = {
  id: 'loan',
  title: 'Loan Payment Calculator',
  description: 'Calculate monthly payments and total interest for loans',
  category: 'finance',
  variables: [
    {
      name: 'amount',
      label: 'Loan Amount',
      type: 'currency',
      required: true,
      defaultValue: 200000,
      description: 'The total amount of the loan',
      validation: {
        min: 1000,
        max: 10000000
      }
    },
    {
      name: 'rate',
      label: 'Annual Interest Rate',
      type: 'percentage',
      required: true,
      defaultValue: 3.5,
      description: 'The annual interest rate of the loan',
      validation: {
        min: 0.1,
        max: 30
      }
    },
    {
      name: 'term',
      label: 'Loan Term',
      type: 'number',
      units: 'years',
      required: true,
      defaultValue: 30,
      description: 'The length of the loan in years',
      validation: {
        min: 1,
        max: 50
      }
    }
  ],
  formulas: [
    {
      name: 'monthlyPayment',
      label: 'Monthly Payment',
      expression: '(amount * ((rate/100)/12) * (1 + (rate/100)/12)^(term*12)) / ((1 + (rate/100)/12)^(term*12) - 1)',
      resultType: 'currency',
      description: 'The monthly payment amount'
    },
    {
      name: 'totalPayment',
      label: 'Total Payment',
      expression: '((amount * ((rate/100)/12) * (1 + (rate/100)/12)^(term*12)) / ((1 + (rate/100)/12)^(term*12) - 1)) * term * 12',
      resultType: 'currency',
      description: 'The total amount paid over the life of the loan'
    },
    {
      name: 'totalInterest',
      label: 'Total Interest',
      expression: '(((amount * ((rate/100)/12) * (1 + (rate/100)/12)^(term*12)) / ((1 + (rate/100)/12)^(term*12) - 1)) * term * 12) - amount',
      resultType: 'currency',
      description: 'The total interest paid over the life of the loan'
    }
  ],
  autoCalculate: true,
  showSteps: true
};
EOF

# BMI Calculator
cat > src/data/calculators/bmi.ts << 'EOF'
import { CalculatorConfig } from '@/types/calculator';

export const bmiConfig: CalculatorConfig = {
  id: 'bmi',
  title: 'BMI Calculator',
  description: 'Calculate your Body Mass Index and health category',
  category: 'health',
  variables: [
    {
      name: 'weight',
      label: 'Weight',
      type: 'number',
      units: 'kg',
      required: true,
      defaultValue: 70,
      description: 'Your weight in kilograms',
      validation: {
        min: 20,
        max: 300
      }
    },
    {
      name: 'height',
      label: 'Height',
      type: 'number',
      units: 'cm',
      required: true,
      defaultValue: 175,
      description: 'Your height in centimeters',
      validation: {
        min: 100,
        max: 250
      }
    }
  ],
  formulas: [
    {
      name: 'bmi',
      label: 'BMI',
      expression: 'weight / ((height/100)^2)',
      resultType: 'decimal',
      description: 'Your Body Mass Index'
    }
  ],
  autoCalculate: true,
  showSteps: false
};
EOF

# 9. Calculator Registry
echo "📋 Creating calculator registry..."
cat > src/data/calculators/index.ts << 'EOF'
import { CalculatorConfig } from '@/types/calculator';
import { compoundInterestConfig } from './compound-interest';
import { loanConfig } from './loan';
import { bmiConfig } from './bmi';

export const calculatorRegistry: Record<string, CalculatorConfig> = {
  'compound-interest': compoundInterestConfig,
  'loan': loanConfig,
  'bmi': bmiConfig
};

export const getCalculatorConfig = (id: string): CalculatorConfig | null => {
  return calculatorRegistry[id] || null;
};

export const getAllCalculators = (): CalculatorConfig[] => {
  return Object.values(calculatorRegistry);
};

export const getCalculatorsByCategory = (category: string): CalculatorConfig[] => {
  return Object.values(calculatorRegistry).filter(
    config => config.category === category
  );
};

export { compoundInterestConfig, loanConfig, bmiConfig };
EOF

# 10. Example Usage Component
echo "🎨 Creating example usage..."
mkdir -p src/components/calculators/examples
cat > src/components/calculators/examples/CalculatorShowcase.tsx << 'EOF'
'use client';

import React, { useState } from 'react';
import { CalculatorEngine } from '../CalculatorEngine';
import { CalculatorEmbed } from '../CalculatorEmbed';
import { compoundInterestConfig, loanConfig, bmiConfig } from '@/data/calculators';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export function CalculatorShowcase() {
  const [selectedCalculator, setSelectedCalculator] = useState('compound-interest');
  
  const calculators = [
    { id: 'compound-interest', config: compoundInterestConfig, badge: 'Finance' },
    { id: 'loan', config: loanConfig, badge: 'Finance' },
    { id: 'bmi', config: bmiConfig, badge: 'Health' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Calculator Engine Showcase
        </h2>
        <p className="text-gray-600 mb-8">
          Explore our powerful calculator engine with real-time calculations, 
          step-by-step breakdowns, and embeddable widgets.
        </p>
      </div>

      <Tabs value={selectedCalculator} onValueChange={setSelectedCalculator}>
        <TabsList className="grid w-full grid-cols-3">
          {calculators.map(calc => (
            <TabsTrigger key={calc.id} value={calc.id} className="flex items-center space-x-2">
              <span>{calc.config.title}</span>
              <Badge variant="secondary" className="text-xs">
                {calc.badge}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {calculators.map(calc => (
          <TabsContent key={calc.id} value={calc.id} className="space-y-8">
            {/* Full Calculator */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Full Calculator</h3>
              <CalculatorEngine config={calc.config} />
            </div>

            {/* Embedded Versions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Embedded Light Theme</h3>
                <CalculatorEmbed 
                  config={calc.config}
                  theme="light"
                  compact={false}
                />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Embedded Compact</h3>
                <CalculatorEmbed 
                  config={calc.config}
                  theme="light"
                  compact={true}
                  showTitle={false}
                />
              </div>
            </div>

            {/* Configuration Preview */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Configuration</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(calc.config, null, 2)}
              </pre>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
EOF

# 11. Create example page to test the calculator
echo "📄 Creating example page..."
mkdir -p src/app/calculators
cat > src/app/calculators/page.tsx << 'EOF'
import { CalculatorShowcase } from '@/components/calculators/examples/CalculatorShowcase';

export default function CalculatorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CalculatorShowcase />
    </div>
  );
}
EOF

# 12. Update UI components index
echo "🔧 Updating UI components..."
cat >> src/components/ui/index.ts << 'EOF'

// Calculator Engine Components
export { CalculatorEngine } from '../calculators/CalculatorEngine';
export { CalculatorForm } from '../calculators/CalculatorForm';
export { CalculatorResult } from '../calculators/CalculatorResult';
export { CalculatorEmbed } from '../calculators/CalculatorEmbed';
EOF

# 13. Create calculator utilities index
cat > src/lib/calculator/index.ts << 'EOF'
export { FormulaEvaluator, formulaEvaluator } from './evaluator';
export { UnitConverter, unitConverter, UNIT_CATEGORIES } from './units';
export { CalculatorValidator, calculatorValidator } from './validator';
export type { UnitDefinition, UnitCategory, ValidationResult } from './units';
EOF

echo "✅ Part 2: Calculator Engine & Components setup complete!"
echo ""
echo "🎯 What was created:"
echo "   ✅ Formula evaluation engine with step-by-step calculations"
echo "   ✅ Unit conversion system with multiple categories"
echo "   ✅ Input validation with real-time feedback"
echo "   ✅ Dynamic calculator components (Engine, Form, Result)"
echo "   ✅ Embeddable calculator widgets"
echo "   ✅ Sample calculators (Compound Interest, Loan, BMI)"
echo "   ✅ Calculator registry and configuration system"
echo "   ✅ Interactive showcase page"
echo ""
echo "🚀 Next steps:"
echo "   1. Run 'npm run dev' to start development server"
echo "   2. Visit '/calculators' to see the calculator showcase"
echo "   3. Test the real-time calculations and step-by-step breakdowns"
echo "   4. Create custom calculator configurations"
echo ""
echo "📁 Key files created:"
echo "   • src/lib/calculator/ - Core calculation engine"
echo "   • src/components/calculators/ - React components"
echo "   • src/data/calculators/ - Sample configurations"
echo "   • src/app/calculators/page.tsx - Demo page"
echo ""
echo "🎨 Features included:"
echo "   • Real-time calculation updates"
echo "   • Input validation with error/warning display"
echo "   • Step-by-step calculation breakdowns"
echo "   • Copy-to-clipboard for results"
echo "   • Embeddable widgets with themes"
echo "   • Unit conversion support"
echo "   • Responsive design"
echo ""
echo "Ready to build amazing calculators! 🧮✨"