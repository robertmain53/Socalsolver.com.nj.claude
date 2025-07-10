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
