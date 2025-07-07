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
