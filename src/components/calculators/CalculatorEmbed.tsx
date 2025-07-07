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
