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
