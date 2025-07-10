import { Metadata } from 'next';

export interface CalculatorSEO {
 id: string;
 title: string;
 description: string;
 category: string;
 variables: any[];
 formulas: any[];
 featured?: boolean;
 trending?: boolean;
 tags?: string[];
 seo: {
 description: string;
 difficulty: string;
 category: string;
 };
 lastUpdated: string;
}

export class MetadataGenerator {
 static generateCalculatorMetadata(calculator: any): Metadata {
 return {
 title: calculator.title,
 description: calculator.seo?.description || calculator.description,
 };
 }

 static generateCategoryMetadata(category: string, calculators: any[]): Metadata {
 return {
 title: `${category} Calculators`,
 description: `${calculators.length} free ${category} calculators`,
 };
 }

 static generateHomeMetadata(): Metadata {
 return {
 title: 'Free Online Calculators',
 description: 'Access hundreds of free online calculators',
 };
 }
}

export class StructuredDataGenerator {
 static generateCalculatorStructuredData(calculator: any): any[] {
 return [
 {
 '@context': 'https://schema.org',
 '@type': 'WebApplication',
 name: calculator.title,
 description: calculator.description,
 }
 ];
 }

 static generateCategoryStructuredData(category: string, calculators: any[]): any[] {
 return [
 {
 '@context': 'https://schema.org',
 '@type': 'CollectionPage',
 name: `${category} Calculators`,
 description: `Collection of ${calculators.length} calculators`,
 }
 ];
 }

 static generateSiteStructuredData(): any {
 return {
 '@context': 'https://schema.org',
 '@type': 'WebSite',
 name: 'Calculator Platform',
 description: 'Free online calculators',
 };
 }
}
