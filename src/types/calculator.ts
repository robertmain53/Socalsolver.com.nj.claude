import { z } from 'zod'

export const CalculatorVariableSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  type: z.enum(['number', 'percentage', 'currency', 'date', 'select']),
  unit?: z.string(),
  min?: z.number(),
  max?: z.number(),
  step?: z.number(),
  required: z.boolean().default(true),
  defaultValue?: z.union([z.string(), z.number()]),
  options?: z.array(z.object({
    value: z.string(),
    label: z.string()
  })),
  validation?: z.string(),
  description?: z.string()
})

export const CalculatorFormulaSchema = z.object({
  id: z.string(),
  expression: z.string(),
  variables: z.array(z.string()),
  resultType: z.enum(['number', 'percentage', 'currency', 'text']),
  resultUnit?: z.string(),
  precision?: z.number().default(2)
})

export const CalculatorConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  variables: z.array(CalculatorVariableSchema),
  formulas: z.array(CalculatorFormulaSchema),
  layout: z.enum(['grid', 'form', 'wizard']).default('form'),
  theme?: z.string(),
  embeddable: z.boolean().default(true)
})

export type CalculatorVariable = z.infer<typeof CalculatorVariableSchema>
export type CalculatorFormula = z.infer<typeof CalculatorFormulaSchema>
export type CalculatorConfig = z.infer<typeof CalculatorConfigSchema>

export interface CalculatorResult {
  formula: string
  value: number | string
  formatted: string
  unit?: string
  breakdown?: {
    step: string
    value: number
    explanation: string
  }[]
}
