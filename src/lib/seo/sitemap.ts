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
 baseUrl = 'https://yourcalculator.com'
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
 baseUrl = 'https://yourcalculator.com'
 ): SitemapEntry[] {
 return categories.map(category => ({
 url: `${baseUrl}/categories/${category}`,
 lastModified: new Date(),
 changeFrequency: 'daily' as const,
 priority: 0.7,
 }));
 }

 static generateStaticSitemap(baseUrl = 'https://yourcalculator.com'): SitemapEntry[] {
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
${entries.map(entry => ` <url>
 <loc>${entry.url}</loc>
 <lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>
 <changefreq>${entry.changeFrequency}</changefreq>
 <priority>${entry.priority}</priority>
 </url>`).join('\n')}
</urlset>`;
 
 return xml;
 }
}
