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
