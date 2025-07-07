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
