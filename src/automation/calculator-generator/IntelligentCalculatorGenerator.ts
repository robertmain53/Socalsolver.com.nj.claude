/**
 * Intelligent Calculator Generator
 * AI-powered system that automatically creates calculators from natural language descriptions
 */

export interface CalculatorSpec {
  name: string;
  description: string;
  category: string;
  inputs: InputSpec[];
  outputs: OutputSpec[];
  formula: string;
  validations: ValidationRule[];
  examples: Example[];
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number;
    tags: string[];
    relatedCalculators: string[];
  };
}

export interface InputSpec {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'boolean' | 'date';
  required: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  helpText?: string;
  unit?: string;
}

export interface OutputSpec {
  id: string;
  label: string;
  format: 'number' | 'currency' | 'percentage' | 'text';
  precision?: number;
  unit?: string;
}

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
}

export interface Example {
  description: string;
  inputs: Record<string, any>;
  expectedOutput: Record<string, any>;
}

export class IntelligentCalculatorGenerator {
  private nlpProcessor: NLPProcessor;
  private formulaGenerator: FormulaGenerator;
  private validationGenerator: ValidationGenerator;
  private testCaseGenerator: TestCaseGenerator;

  constructor() {
    this.nlpProcessor = new NLPProcessor();
    this.formulaGenerator = new FormulaGenerator();
    this.validationGenerator = new ValidationGenerator();
    this.testCaseGenerator = new TestCaseGenerator();
  }

  async generateCalculator(description: string, options: {
    category?: string;
    complexity?: 'simple' | 'moderate' | 'complex';
    includeValidation?: boolean;
    generateTests?: boolean;
  } = {}): Promise<CalculatorSpec> {

    // Step 1: Parse the natural language description
    const parsedSpec = await this.nlpProcessor.parseDescription(description);

    // Step 2: Generate inputs and outputs
    const inputs = await this.generateInputs(parsedSpec, options.complexity);
    const outputs = await this.generateOutputs(parsedSpec);

    // Step 3: Generate formula
    const formula = await this.formulaGenerator.generate(parsedSpec, inputs, outputs);

    // Step 4: Generate validations
    const validations = options.includeValidation 
      ? await this.validationGenerator.generate(inputs, parsedSpec)
      : [];

    // Step 5: Generate test cases/examples
    const examples = options.generateTests
      ? await this.testCaseGenerator.generate(inputs, outputs, formula)
      : [];

    // Step 6: Determine metadata
    const metadata = await this.generateMetadata(parsedSpec, inputs, outputs, options);

    const calculatorSpec: CalculatorSpec = {
      name: parsedSpec.name || this.generateName(parsedSpec),
      description: parsedSpec.description || description,
      category: options.category || parsedSpec.category || 'general',
      inputs,
      outputs,
      formula,
      validations,
      examples,
      metadata
    };

    // Step 7: Validate and optimize the generated calculator
    await this.validateAndOptimize(calculatorSpec);

    return calculatorSpec;
  }

  async enhanceExistingCalculator(
    calculatorId: string, 
    enhancement: 'add_validation' | 'improve_formula' | 'add_features' | 'optimize_performance',
    options: any = {}
  ): Promise<Partial<CalculatorSpec>> {

    const existingCalculator = await this.getExistingCalculator(calculatorId);
    
    switch (enhancement) {
      case 'add_validation':
        return {
          validations: await this.validationGenerator.generate(existingCalculator.inputs, existingCalculator)
        };
      
      case 'improve_formula':
        return {
          formula: await this.formulaGenerator.optimize(existingCalculator.formula, existingCalculator.inputs)
        };
      
      case 'add_features':
        const newInputs = await this.suggestAdditionalInputs(existingCalculator);
        const newOutputs = await this.suggestAdditionalOutputs(existingCalculator);
        return {
          inputs: [...existingCalculator.inputs, ...newInputs],
          outputs: [...existingCalculator.outputs, ...newOutputs]
        };
      
      case 'optimize_performance':
        return {
          formula: await this.formulaGenerator.optimize(existingCalculator.formula, existingCalculator.inputs),
          validations: this.optimizeValidations(existingCalculator.validations)
        };
      
      default:
        throw new Error(`Unknown enhancement type: ${enhancement}`);
    }
  }

  async generateVariations(baseCalculator: CalculatorSpec, variations: {
    difficulty: Array<'beginner' | 'intermediate' | 'advanced'>;
    use_cases: string[];
    target_audiences: string[];
  }): Promise<CalculatorSpec[]> {

    const generatedVariations: CalculatorSpec[] = [];

    // Generate difficulty variations
    for (const difficulty of variations.difficulty) {
      if (difficulty !== baseCalculator.metadata.difficulty) {
        const variation = await this.createDifficultyVariation(baseCalculator, difficulty);
        generatedVariations.push(variation);
      }
    }

    // Generate use case variations
    for (const useCase of variations.use_cases) {
      const variation = await this.createUseCaseVariation(baseCalculator, useCase);
      generatedVariations.push(variation);
    }

    // Generate audience variations
    for (const audience of variations.target_audiences) {
      const variation = await this.createAudienceVariation(baseCalculator, audience);
      generatedVariations.push(variation);
    }

    return generatedVariations;
  }

  private async generateInputs(parsedSpec: any, complexity?: string): Promise<InputSpec[]> {
    const baseInputs = parsedSpec.inputs || [];
    const inputs: InputSpec[] = [];

    for (const input of baseInputs) {
      inputs.push({
        id: this.sanitizeId(input.name),
        label: input.label || input.name,
        type: this.determineInputType(input),
        required: input.required !== false,
        validation: this.generateInputValidation(input),
        helpText: input.helpText || this.generateHelpText(input),
        unit: input.unit
      });
    }

    // Add complexity-based inputs
    if (complexity === 'complex') {
      inputs.push(...this.generateAdvancedInputs(parsedSpec));
    }

    return inputs;
  }

  private async generateOutputs(parsedSpec: any): Promise<OutputSpec[]> {
    const outputs: OutputSpec[] = [];

    for (const output of parsedSpec.outputs || []) {
      outputs.push({
        id: this.sanitizeId(output.name),
        label: output.label || output.name,
        format: this.determineOutputFormat(output),
        precision: output.precision || 2,
        unit: output.unit
      });
    }

    return outputs;
  }

  private async generateMetadata(parsedSpec: any, inputs: InputSpec[], outputs: OutputSpec[], options: any): Promise<any> {
    return {
      difficulty: this.determineDifficulty(inputs, outputs, parsedSpec),
      estimatedTime: this.estimateTime(inputs, outputs),
      tags: this.generateTags(parsedSpec, inputs, outputs),
      relatedCalculators: await this.findRelatedCalculators(parsedSpec)
    };
  }

  private sanitizeId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  private determineInputType(input: any): 'number' | 'text' | 'select' | 'boolean' | 'date' {
    if (input.type) return input.type;
    if (input.options) return 'select';
    if (input.name.includes('date') || input.name.includes('time')) return 'date';
    if (input.name.includes('amount') || input.name.includes('rate') || input.name.includes('value')) return 'number';
    if (input.name.includes('enable') || input.name.includes('include')) return 'boolean';
    return 'text';
  }

  private determineOutputFormat(output: any): 'number' | 'currency' | 'percentage' | 'text' {
    if (output.format) return output.format;
    if (output.name.includes('amount') || output.name.includes('payment') || output.name.includes('cost')) return 'currency';
    if (output.name.includes('rate') || output.name.includes('percent')) return 'percentage';
    if (output.unit || output.name.includes('count') || output.name.includes('value')) return 'number';
    return 'text';
  }

  private generateInputValidation(input: any): any {
    const validation: any = {};

    if (input.type === 'number') {
      if (input.name.includes('rate') || input.name.includes('percent')) {
        validation.min = 0;
        validation.max = 100;
      } else if (input.name.includes('amount') || input.name.includes('value')) {
        validation.min = 0;
        validation.max = 10000000; // 10 million default max
      }
    }

    return Object.keys(validation).length > 0 ? validation : undefined;
  }

  private generateHelpText(input: any): string {
    const helpTexts: Record<string, string> = {
      'interest_rate': 'Enter the annual interest rate as a percentage (e.g., 3.5 for 3.5%)',
      'loan_amount': 'Enter the total amount you want to borrow',
      'loan_term': 'Enter the loan term in years',
      'monthly_payment': 'Enter your desired monthly payment amount',
      'down_payment': 'Enter the down payment amount or percentage'
    };

    const key = this.sanitizeId(input.name);
    return helpTexts[key] || `Enter the ${input.name.toLowerCase()}`;
  }

  private generateAdvancedInputs(parsedSpec: any): InputSpec[] {
    // Generate additional advanced inputs based on calculator type
    const advanced: InputSpec[] = [];

    if (parsedSpec.category === 'finance') {
      advanced.push(
        {
          id: 'compound_frequency',
          label: 'Compounding Frequency',
          type: 'select',
          required: false,
          validation: {
            options: ['Monthly', 'Quarterly', 'Annually']
          },
          helpText: 'How often interest is compounded'
        },
        {
          id: 'inflation_rate',
          label: 'Expected Inflation Rate (%)',
          type: 'number',
          required: false,
          validation: { min: 0, max: 20 },
          helpText: 'Annual inflation rate to adjust for purchasing power'
        }
      );
    }

    return advanced;
  }

  private determineDifficulty(inputs: InputSpec[], outputs: OutputSpec[], parsedSpec: any): 'beginner' | 'intermediate' | 'advanced' {
    const inputCount = inputs.length;
    const hasAdvancedInputs = inputs.some(input => 
      input.type === 'select' || 
      input.validation?.pattern || 
      input.id.includes('advanced') ||
      input.id.includes('compound') ||
      input.id.includes('inflation')
    );

    if (inputCount <= 3 && !hasAdvancedInputs) return 'beginner';
    if (inputCount <= 6 && !hasAdvancedInputs) return 'intermediate';
    return 'advanced';
  }

  private estimateTime(inputs: InputSpec[], outputs: OutputSpec[]): number {
    // Estimate time in minutes based on complexity
    const baseTime = 2; // 2 minutes base
    const inputTime = inputs.length * 0.5; // 30 seconds per input
    const complexityBonus = inputs.filter(i => i.type === 'select' || i.validation?.pattern).length * 1;
    
    return Math.ceil(baseTime + inputTime + complexityBonus);
  }

  private generateTags(parsedSpec: any, inputs: InputSpec[], outputs: OutputSpec[]): string[] {
    const tags: string[] = [];
    
    // Add category-based tags
    if (parsedSpec.category) {
      tags.push(parsedSpec.category);
    }

    // Add input-based tags
    inputs.forEach(input => {
      if (input.id.includes('loan')) tags.push('loans');
      if (input.id.includes('mortgage')) tags.push('mortgage');
      if (input.id.includes('investment')) tags.push('investment');
      if (input.id.includes('tax')) tags.push('taxes');
      if (input.id.includes('health') || input.id.includes('bmi')) tags.push('health');
    });

    // Add unique tags only
    return [...new Set(tags)];
  }

  private async findRelatedCalculators(parsedSpec: any): Promise<string[]> {
    // Find calculators that might be related based on category and inputs
    const related: string[] = [];

    if (parsedSpec.category === 'finance') {
      related.push('mortgage', 'loan', 'savings', 'investment');
    } else if (parsedSpec.category === 'health') {
      related.push('bmi', 'calorie', 'fitness');
    }

    return related.slice(0, 5); // Limit to 5 related calculators
  }

  private async validateAndOptimize(calculatorSpec: CalculatorSpec): Promise<void> {
    // Validate that all references in formula exist in inputs
    this.validateFormulaReferences(calculatorSpec);
    
    // Optimize input order for better UX
    this.optimizeInputOrder(calculatorSpec);
    
    // Add missing validations
    this.addImplicitValidations(calculatorSpec);
  }

  private validateFormulaReferences(calculatorSpec: CalculatorSpec): void {
    const inputIds = new Set(calculatorSpec.inputs.map(input => input.id));
    const formulaRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    const matches = calculatorSpec.formula.match(formulaRegex) || [];
    
    for (const match of matches) {
      if (!inputIds.has(match) && !this.isBuiltInFunction(match)) {
        console.warn(`Formula references unknown variable: ${match}`);
      }
    }
  }

  private isBuiltInFunction(name: string): boolean {
    const builtInFunctions = ['Math', 'pow', 'sqrt', 'abs', 'round', 'max', 'min', 'PMT', 'FV', 'PV'];
    return builtInFunctions.includes(name);
  }

  private optimizeInputOrder(calculatorSpec: CalculatorSpec): void {
    // Sort inputs by importance and logical flow
    calculatorSpec.inputs.sort((a, b) => {
      const priorityA = this.getInputPriority(a);
      const priorityB = this.getInputPriority(b);
      return priorityB - priorityA;
    });
  }

  private getInputPriority(input: InputSpec): number {
    // Higher numbers = higher priority (shown first)
    if (input.required) return 10;
    if (input.type === 'number') return 8;
    if (input.type === 'select') return 6;
    if (input.type === 'boolean') return 4;
    return 2;
  }

  private addImplicitValidations(calculatorSpec: CalculatorSpec): void {
    calculatorSpec.inputs.forEach(input => {
      if (!input.validation && input.type === 'number') {
        input.validation = { min: 0 }; // Default: no negative numbers
      }
    });
  }

  private async createDifficultyVariation(baseCalculator: CalculatorSpec, difficulty: string): Promise<CalculatorSpec> {
    const variation = { ...baseCalculator };
    variation.name = `${baseCalculator.name} (${difficulty})`;
    variation.metadata.difficulty = difficulty as any;

    if (difficulty === 'beginner') {
      // Simplify inputs
      variation.inputs = variation.inputs.filter(input => input.required);
      variation.inputs.forEach(input => {
        if (input.helpText) {
          input.helpText = this.simplifyHelpText(input.helpText);
        }
      });
    } else if (difficulty === 'advanced') {
      // Add advanced features
      variation.inputs.push(...this.generateAdvancedInputs(baseCalculator));
    }

    return variation;
  }

  private simplifyHelpText(helpText: string): string {
    return helpText.replace(/\([^)]*\)/g, '').trim(); // Remove parenthetical explanations
  }

  private async createUseCaseVariation(baseCalculator: CalculatorSpec, useCase: string): Promise<CalculatorSpec> {
    const variation = { ...baseCalculator };
    variation.name = `${baseCalculator.name} for ${useCase}`;
    variation.description = `${baseCalculator.description} Optimized for ${useCase}.`;
    
    // Customize based on use case
    // This would involve specific logic for each use case
    
    return variation;
  }

  private async createAudienceVariation(baseCalculator: CalculatorSpec, audience: string): Promise<CalculatorSpec> {
    const variation = { ...baseCalculator };
    variation.name = `${baseCalculator.name} for ${audience}`;
    
    // Adjust complexity and terminology based on audience
    if (audience.includes('student')) {
      variation.metadata.difficulty = 'beginner';
      variation.inputs.forEach(input => {
        input.helpText = this.makeEducational(input.helpText || '');
      });
    }
    
    return variation;
  }

  private makeEducational(helpText: string): string {
    return `${helpText} (This helps you understand how ${helpText.split(' ')[0].toLowerCase()} affects the calculation)`;
  }

  private async getExistingCalculator(calculatorId: string): Promise<CalculatorSpec> {
    // This would fetch from database
    throw new Error('Calculator not found');
  }

  private async suggestAdditionalInputs(calculator: CalculatorSpec): Promise<InputSpec[]> {
    // AI-powered suggestions for additional inputs
    return [];
  }

  private async suggestAdditionalOutputs(calculator: CalculatorSpec): Promise<OutputSpec[]> {
    // AI-powered suggestions for additional outputs
    return [];
  }

  private optimizeValidations(validations: ValidationRule[]): ValidationRule[] {
    // Optimize validation rules for performance
    return validations;
  }

  private generateName(parsedSpec: any): string {
    return `${parsedSpec.category || 'General'} Calculator`;
  }
}

// Supporting classes would be implemented similarly
class NLPProcessor {
  async parseDescription(description: string): Promise<any> {
    // Parse natural language description
    return {};
  }
}

class FormulaGenerator {
  async generate(parsedSpec: any, inputs: InputSpec[], outputs: OutputSpec[]): Promise<string> {
    // Generate formula based on specification
    return '';
  }

  async optimize(formula: string, inputs: InputSpec[]): Promise<string> {
    // Optimize existing formula
    return formula;
  }
}

class ValidationGenerator {
  async generate(inputs: InputSpec[], parsedSpec: any): Promise<ValidationRule[]> {
    // Generate validation rules
    return [];
  }
}

class TestCaseGenerator {
  async generate(inputs: InputSpec[], outputs: OutputSpec[], formula: string): Promise<Example[]> {
    // Generate test cases/examples
    return [];
  }
}
