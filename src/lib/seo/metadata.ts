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
 baseUrl = 'https://yourcalculator.com'
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
 baseUrl = 'https://yourcalculator.com'
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
 url: `${baseUrl}/categories/${category}`,
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

 static generateHomeMetadata(baseUrl = 'https://yourcalculator.com'): Metadata {
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
