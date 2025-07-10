export function evaluate(expression: string, variables: Record<string, number>): number {
 // Simple math expression evaluator
 // In production, use a proper math parser like math.js
 let result = expression
 
 Object.entries(variables).forEach(([key, value]) => {
 result = result.replace(new RegExp(`\\b${key}\\b`, 'g'), value.toString())
 })
 
 // Basic safety check - only allow numbers, operators, and parentheses
 if (!/^[0-9+\-*/.() ]+$/.test(result)) {
 throw new Error('Invalid expression')
 }
 
 try {
 return Function(`"use strict"; return (${result})`)()
 } catch (error) {
 throw new Error('Failed to evaluate expression')
 }
}

export function formatNumber(value: number, precision: number = 2): string {
 return value.toLocaleString('en-US', {
 minimumFractionDigits: precision,
 maximumFractionDigits: precision
 })
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency
 }).format(value)
}

export function formatPercentage(value: number, precision: number = 2): string {
 return `${(value * 100).toFixed(precision)}%`
}
