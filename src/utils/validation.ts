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
