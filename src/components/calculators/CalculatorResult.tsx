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
