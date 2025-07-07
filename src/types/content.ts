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
