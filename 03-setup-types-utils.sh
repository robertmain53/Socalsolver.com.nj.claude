#!/bin/bash

# Calculator Platform - Part 1: Core Types and Utilities Setup
# This script creates foundational TypeScript types and utility functions

echo "🔧 Creating core types and utilities..."

# Create global types
cat > src/types/index.ts << 'EOF'
export * from './calculator'
export * from './content'
export * from './ai'
export * from './i18n'

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface Author {
  id: string
  name: string
  title: string
  bio: string
  credentials: string[]
  avatar?: string
  social?: {
    linkedin?: string
    twitter?: string
    website?: string
  }
}

export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  canonicalUrl?: string
  ogImage?: string
  structuredData?: any
}
EOF

# Create calculator types
cat > src/types/calculator.ts << 'EOF'
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
EOF

# Create content types
cat > src/types/content.ts << 'EOF'
import { z } from 'zod'
import type { Author } from './index'

export const ContentStatusSchema = z.enum([
  'draft',
  'review',
  'approved',
  'published',
  'archived'
])

export const ContentFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  audience: z.enum(['students', 'professionals', 'general', 'experts']),
  author: z.string(),
  reviewedBy: z.string().optional(),
  lastReviewed: z.string().optional(),
  calculatorId: z.string(),
  slug: z.string(),
  locale: z.string().default('en'),
  publishedAt: z.string().optional(),
  updatedAt: z.string(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    canonicalUrl: z.string().optional()
  }).optional()
})

export const ContentSectionSchema = z.object({
  type: z.enum(['tool', 'explain', 'learn', 'challenge']),
  title: z.string(),
  content: z.string(),
  metadata: z.record(z.any()).optional()
})

export const ContentSchema = z.object({
  frontmatter: ContentFrontmatterSchema,
  sections: z.array(ContentSectionSchema),
  rawContent: z.string(),
  status: ContentStatusSchema
})

export type ContentStatus = z.infer<typeof ContentStatusSchema>
export type ContentFrontmatter = z.infer<typeof ContentFrontmatterSchema>
export type ContentSection = z.infer<typeof ContentSectionSchema>
export type Content = z.infer<typeof ContentSchema>

export interface ContentWorkflow {
  id: string
  contentId: string
  status: ContentStatus
  actor: string
  timestamp: Date
  notes?: string
  aiGenerated?: boolean
}
EOF

# Create AI types
cat > src/types/ai.ts << 'EOF'
import { z } from 'zod'

export const AIPromptConfigSchema = z.object({
  type: z.enum(['explain', 'learn', 'challenge', 'review', 'improve']),
  template: z.string(),
  variables: z.array(z.string()),
  model: z.string().default('gpt-4'),
  maxTokens: z.number().default(1000),
  temperature: z.number().default(0.7),
  systemPrompt: z.string().optional()
})

export const AIGenerationRequestSchema = z.object({
  contentId: z.string(),
  promptType: z.enum(['explain', 'learn', 'challenge']),
  context: z.record(z.any()),
  locale: z.string().default('en'),
  regenerate: z.boolean().default(false)
})

export const AIReviewRequestSchema = z.object({
  contentId: z.string(),
  section: z.enum(['explain', 'learn', 'challenge', 'all']),
  criteria: z.array(z.string()),
  feedback: z.string().optional()
})

export type AIPromptConfig = z.infer<typeof AIPromptConfigSchema>
export type AIGenerationRequest = z.infer<typeof AIGenerationRequestSchema>
export type AIReviewRequest = z.infer<typeof AIReviewRequestSchema>

export interface AIResponse {
  content: string
  metadata: {
    model: string
    tokensUsed: number
    confidence: number
    timestamp: Date
  }
  suggestions?: string[]
  issues?: string[]
}
EOF

# Create i18n types
cat > src/types/i18n.ts << 'EOF'
import { z } from 'zod'

export const LocaleSchema = z.enum(['en', 'es', 'fr', 'it'])

export const TranslationRequestSchema = z.object({
  contentId: z.string(),
  targetLocale: LocaleSchema,
  sections: z.array(z.enum(['explain', 'learn', 'challenge'])),
  preserveFormatting: z.boolean().default(true)
})

export type Locale = z.infer<typeof LocaleSchema>
export type TranslationRequest = z.infer<typeof TranslationRequestSchema>

export interface LocaleContent {
  locale: Locale
  content: Record<string, string>
  metadata: {
    translatedBy?: string
    translatedAt?: Date
    reviewedBy?: string
    reviewedAt?: Date
  }
}
EOF

# Create utility functions
cat > src/utils/index.ts << 'EOF'
export * from './math'
export * from './format'
export * from './validation'

export function cn(...inputs: (string | undefined)[]): string {
  return inputs.filter(Boolean).join(' ')
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
EOF

# Create math utilities
cat > src/utils/math.ts << 'EOF'
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
EOF

# Create format utilities
cat > src/utils/format.ts << 'EOF'
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content.replace(/<[^>]*>/g, '').trim()
  return truncate(plainText, maxLength)
}
EOF

# Create validation utilities
cat > src/utils/validation.ts << 'EOF'
import { z } from 'zod'

export const emailSchema = z.string().email()
export const slugSchema = z.string().regex(/^[a-z0-9-]+$/)
export const urlSchema = z.string().url()

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}

export function validateSlug(slug: string): boolean {
  return slugSchema.safeParse(slug).success
}

export function validateUrl(url: string): boolean {
  return urlSchema.safeParse(url).success
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
}
EOF

echo "✅ Core types and utilities created successfully"