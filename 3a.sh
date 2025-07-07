#!/bin/bash

# Calculator Platform - Part 3A: SEO Infrastructure & Metadata System
# Creates comprehensive SEO utilities, metadata generation, and structured data

echo "🚀 Building Calculator Platform - Part 3A: SEO Infrastructure..."

# Create SEO utilities directory
mkdir -p src/lib/seo

# SEO metadata generator
cat > src/lib/seo/metadata.ts << 'EOF'
import { Metadata } from 'next';
import { CalculatorConfig } from '@/types/calculator';

interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  useCase: string[];
  relatedTopics: string[];
}

export interface CalculatorSEO extends CalculatorConfig {
  seo: SEOConfig;
  lastUpdated: string;
  featured?: boolean;
  trending?: boolean;
}

export class MetadataGenerator {
  static generateCalculatorMetadata(
    calculator: CalculatorSEO,
    baseUrl: string = 'https://yourcalculator.com'
  ): Metadata {
    const { id, title, description, seo } = calculator;
    const canonicalUrl = `${baseUrl}/calculators/${id}`;
    
    const metaTitle = `${title} - Free Online Calculator`;
    const metaDescription = seo.description || description || 
      `Calculate ${title.toLowerCase()} instantly with our free, accurate online calculator. Get results in seconds with step-by-step explanations.`;
    
    const keywords = [
      title.toLowerCase(),
      'calculator',
      'free calculator',
      'online calculator',
      ...seo.keywords,
      seo.category,
      ...seo.useCase.map(use => `${use} calculator`)
    ].join(', ');

    return {
      title: metaTitle,
      description: metaDescription,
      keywords,
      authors: [{ name: 'Calculator Platform Team' }],
      creator: 'Calculator Platform',
      publisher: 'Calculator Platform',
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: canonicalUrl,
        title: metaTitle,
        description: metaDescription,
        siteName: 'Calculator Platform',
        images: [
          {
            url: `${baseUrl}/api/og/calculator/${id}`,
            width: 1200,
            height: 630,
            alt: `${title} Calculator`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [`${baseUrl}/api/og/calculator/${id}`],
        creator: '@calculatorplatform',
      },
      alternates: {
        canonical: canonicalUrl,
      },
      other: {
        'msapplication-TileColor': '#3b82f6',
        'theme-color': '#3b82f6',
      },
    };
  }

  static generateCategoryMetadata(
    category: string,
    calculators: CalculatorSEO[],
    baseUrl: string = 'https://yourcalculator.com'
  ): Metadata {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    const calculatorCount = calculators.length;
    
    const title = `${categoryTitle} Calculators - ${calculatorCount} Free Online Tools`;
    const description = `Explore ${calculatorCount} free ${category.toLowerCase()} calculators. Accurate, instant results with step-by-step explanations for all your ${category.toLowerCase()} calculations.`;
    
    return {
      title,
      description,
      keywords: `${category} calculator, ${category} tools, online ${category}, free calculator`,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/calculators/category/${category}`,
        type: 'website',
        images: [
          {
            url: `${baseUrl}/api/og/category/${category}`,
            width: 1200,
            height: 630,
            alt: `${categoryTitle} Calculators`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${baseUrl}/api/og/category/${category}`],
      },
    };
  }

  static generateHomeMetadata(baseUrl: string = 'https://yourcalculator.com'): Metadata {
    return {
      title: 'Free Online Calculators - Instant, Accurate Results',
      description: 'Access hundreds of free online calculators for math, finance, health, science, and more. Get instant, accurate results with step-by-step explanations.',
      keywords: 'calculator, online calculator, free calculator, math calculator, finance calculator, health calculator',
      openGraph: {
        title: 'Free Online Calculators - Instant, Accurate Results',
        description: 'Access hundreds of free online calculators for math, finance, health, science, and more.',
        url: baseUrl,
        type: 'website',
        images: [
          {
            url: `${baseUrl}/api/og/home`,
            width: 1200,
            height: 630,
            alt: 'Calculator Platform - Free Online Calculators',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Free Online Calculators - Instant, Accurate Results',
        description: 'Access hundreds of free online calculators for math, finance, health, science, and more.',
        images: [`${baseUrl}/api/og/home`],
      },
    };
  }
}
EOF

# Structured data generator
cat > src/lib/seo/structured-data.ts << 'EOF'
import { CalculatorSEO } from './metadata';

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export class StructuredDataGenerator {
  static generateCalculatorStructuredData(
    calculator: CalculatorSEO,
    baseUrl: string = 'https://yourcalculator.com'
  ): StructuredData[] {
    const canonicalUrl = `${baseUrl}/calculators/${calculator.id}`;
    
    const websiteData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: calculator.title,
      description: calculator.seo.description || calculator.description,
      url: canonicalUrl,
      applicationCategory: 'Calculator',
      operatingSystem: 'Any',
      permissions: 'browser',
      isAccessibleForFree: true,
      author: {
        '@type': 'Organization',
        name: 'Calculator Platform',
        url: baseUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Calculator Platform',
        url: baseUrl,
      },
      datePublished: '2024-01-01',
      dateModified: calculator.lastUpdated,
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'UseAction',
        target: canonicalUrl,
      },
    };

    const breadcrumbData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Calculators',
          item: `${baseUrl}/calculators`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: calculator.seo.category,
          item: `${baseUrl}/calculators/category/${calculator.seo.category}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: calculator.title,
          item: canonicalUrl,
        },
      ],
    };

    const faqData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `How to use the ${calculator.title}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Enter your values in the ${calculator.title} and get instant results. Our calculator provides accurate calculations with step-by-step explanations.`,
          },
        },
        {
          '@type': 'Question',
          name: `Is the ${calculator.title} free to use?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Yes, our ${calculator.title} is completely free to use with no registration required.`,
          },
        },
        {
          '@type': 'Question',
          name: `How accurate is the ${calculator.title}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Our ${calculator.title} uses precise mathematical formulas to ensure accurate results for all calculations.`,
          },
        },
      ],
    };

    return [websiteData, breadcrumbData, faqData];
  }

  static generateCategoryStructuredData(
    category: string,
    calculators: CalculatorSEO[],
    baseUrl: string = 'https://yourcalculator.com'
  ): StructuredData[] {
    const categoryUrl = `${baseUrl}/calculators/category/${category}`;
    
    const collectionData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category} Calculators`,
      description: `Collection of ${calculators.length} free ${category} calculators`,
      url: categoryUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: calculators.length,
        itemListElement: calculators.map((calc, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'WebApplication',
            name: calc.title,
            description: calc.seo.description || calc.description,
            url: `${baseUrl}/calculators/${calc.id}`,
          },
        })),
      },
    };

    return [collectionData];
  }

  static generateSiteStructuredData(baseUrl: string = 'https://yourcalculator.com'): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Calculator Platform',
      description: 'Free online calculators for math, finance, health, science, and more',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Calculator Platform',
        url: baseUrl,
      },
    };
  }
}
EOF

# URL slug generator
cat > src/lib/seo/slugs.ts << 'EOF'
export class SlugGenerator {
  static createSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  static createCalculatorSlug(title: string, category?: string): string {
    const baseSlug = this.createSlug(title);
    
    // Remove common calculator words to make URLs cleaner
    const cleanSlug = baseSlug
      .replace(/^(calculator|calc|tool)-?/, '')
      .replace(/-?(calculator|calc|tool)$/, '');
    
    return cleanSlug || baseSlug;
  }

  static createCategorySlug(category: string): string {
    return this.createSlug(category);
  }

  static validateSlug(slug: string): boolean {
    // Check if slug is valid (no special characters, not empty, reasonable length)
    return /^[a-z0-9-]+$/.test(slug) && slug.length > 0 && slug.length <= 100;
  }

  static generateAlternativeSlug(baseSlug: string, existingSlugs: string[]): string {
    if (!existingSlugs.includes(baseSlug)) {
      return baseSlug;
    }

    let counter = 1;
    let newSlug = `${baseSlug}-${counter}`;
    
    while (existingSlugs.includes(newSlug)) {
      counter++;
      newSlug = `${baseSlug}-${counter}`;
    }
    
    return newSlug;
  }
}
EOF

# Sitemap generator
cat > src/lib/seo/sitemap.ts << 'EOF'
import { CalculatorSEO } from './metadata';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SitemapGenerator {
  static generateCalculatorSitemap(
    calculators: CalculatorSEO[],
    baseUrl: string = 'https://yourcalculator.com'
  ): SitemapEntry[] {
    return calculators.map(calculator => ({
      url: `${baseUrl}/calculators/${calculator.id}`,
      lastModified: new Date(calculator.lastUpdated),
      changeFrequency: 'weekly' as const,
      priority: calculator.featured ? 0.9 : 0.8,
    }));
  }

  static generateCategorySitemap(
    categories: string[],
    baseUrl: string = 'https://yourcalculator.com'
  ): SitemapEntry[] {
    return categories.map(category => ({
      url: `${baseUrl}/calculators/category/${category}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));
  }

  static generateStaticSitemap(baseUrl: string = 'https://yourcalculator.com'): SitemapEntry[] {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/calculators`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ];
  }

  static generateXMLSitemap(entries: SitemapEntry[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    return xml;
  }
}
EOF

# Create index file for SEO exports
cat > src/lib/seo/index.ts << 'EOF'
export * from './metadata';
export * from './structured-data';
export * from './slugs';
export * from './sitemap';
EOF

echo "✅ SEO Infrastructure created!"
echo "   📁 src/lib/seo/"
echo "   ├── metadata.ts - SEO metadata generation"
echo "   ├── structured-data.ts - Schema.org structured data"
echo "   ├── slugs.ts - URL slug generation"
echo "   ├── sitemap.ts - XML sitemap generation"
echo "   └── index.ts - Exports"
echo ""
echo "🎯 Key Features:"
echo "   • Comprehensive meta tags and Open Graph"
echo "   • Schema.org structured data for rich snippets"
echo "   • SEO-friendly URL slug generation"
echo "   • XML sitemap generation"
echo "   • Twitter Cards and social media optimization"