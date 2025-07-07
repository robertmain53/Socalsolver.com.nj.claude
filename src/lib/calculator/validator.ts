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
