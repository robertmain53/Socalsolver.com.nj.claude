import { CalculatorSEO } from '@/lib/seo';
import { SlugGenerator } from '@/lib/seo';

export interface CalculatorDraft {
  id?: string;
  title: string;
  description: string;
  category: string;
  variables: any[];
  formulas: any[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    useCase: string[];
    relatedTopics: string[];
  };
  status: 'draft' | 'review' | 'published';
  author: string;
  createdAt: string;
  updatedAt: string;
}

export class CalculatorManager {
  static validateCalculatorConfig(config: Partial<CalculatorSEO>): string[] {
    const errors: string[] = [];

    // Required fields validation
    if (!config.title?.trim()) {
      errors.push('Title is required');
    }

    if (!config.description?.trim()) {
      errors.push('Description is required');
    }

    if (!config.category?.trim()) {
      errors.push('Category is required');
    }

    if (!config.variables || config.variables.length === 0) {
      errors.push('At least one variable is required');
    }

    if (!config.formulas || config.formulas.length === 0) {
      errors.push('At least one formula is required');
    }

    // SEO validation
    if (!config.seo) {
      errors.push('SEO configuration is required');
    } else {
      if (!config.seo.title?.trim()) {
        errors.push('SEO title is required');
      }

      if (!config.seo.description?.trim()) {
        errors.push('SEO description is required');
      }

      if (!config.seo.keywords || config.seo.keywords.length === 0) {
        errors.push('At least one SEO keyword is required');
      }

      if (config.seo.keywords && config.seo.keywords.some(k => k.length < 3)) {
        errors.push('Keywords must be at least 3 characters long');
      }
    }

    // Variables validation
    if (config.variables) {
      config.variables.forEach((variable, index) => {
        if (!variable.name?.trim()) {
          errors.push(`Variable ${index + 1}: Name is required`);
        }

        if (!variable.label?.trim()) {
          errors.push(`Variable ${index + 1}: Label is required`);
        }

        if (!variable.type) {
          errors.push(`Variable ${index + 1}: Type is required`);
        }

        if (variable.type === 'number' && variable.min !== undefined && variable.max !== undefined) {
          if (variable.min >= variable.max) {
            errors.push(`Variable ${index + 1}: Min value must be less than max value`);
          }
        }
      });
    }

    // Formulas validation
    if (config.formulas) {
      config.formulas.forEach((formula, index) => {
        if (!formula.name?.trim()) {
          errors.push(`Formula ${index + 1}: Name is required`);
        }

        if (!formula.expression?.trim()) {
          errors.push(`Formula ${index + 1}: Expression is required`);
        }

        // Basic expression validation
        if (formula.expression && !/^[a-zA-Z0-9+\-*/()\s.,^<>=!&|?:]+$/.test(formula.expression)) {
          errors.push(`Formula ${index + 1}: Expression contains invalid characters`);
        }
      });
    }

    return errors;
  }

  static generateCalculatorId(title: string, existingIds: string[] = []): string {
    const baseSlug = SlugGenerator.createCalculatorSlug(title);
    return SlugGenerator.generateAlternativeSlug(baseSlug, existingIds);
  }

  static generateSEOKeywords(title: string, description: string, category: string): string[] {
    const keywords = new Set<string>();
    
    // Add title-based keywords
    const titleWords = title.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    titleWords.forEach(word => {
      keywords.add(word);
      keywords.add(`${word} calculator`);
    });

    // Add category-based keywords
    keywords.add(category);
    keywords.add(`${category} calculator`);
    keywords.add(`${category} tool`);
    keywords.add(`online ${category}`);

    // Add common calculator keywords
    keywords.add('calculator');
    keywords.add('free calculator');
    keywords.add('online calculator');
    keywords.add('calculation tool');

    // Extract keywords from description
    const descriptionWords = description.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 4);
    
    descriptionWords.slice(0, 5).forEach(word => keywords.add(word));

    return Array.from(keywords).slice(0, 15); // Limit to 15 keywords
  }

  static generateUseCases(category: string, title: string): string[] {
    const categoryUseCases: Record<string, string[]> = {
      finance: [
        'financial planning',
        'investment analysis',
        'loan comparison',
        'budget management',
        'retirement planning',
      ],
      health: [
        'health monitoring',
        'fitness tracking',
        'medical consultation prep',
        'wellness assessment',
        'health goal setting',
      ],
      math: [
        'homework help',
        'problem solving',
        'mathematical analysis',
        'academic research',
        'skill development',
      ],
      science: [
        'scientific research',
        'laboratory calculations',
        'academic projects',
        'professional analysis',
        'educational purposes',
      ],
      engineering: [
        'engineering design',
        'project calculations',
        'professional analysis',
        'construction planning',
        'technical assessment',
      ],
      conversion: [
        'unit conversion',
        'measurement conversion',
        'international standards',
        'recipe scaling',
        'travel planning',
      ],
    };

    return categoryUseCases[category] || ['general calculations', 'problem solving', 'analysis'];
  }

  static exportCalculatorConfig(config: CalculatorSEO): string {
    const exportData = {
      ...config,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    return `import { CalculatorSEO } from '@/lib/seo';

export const ${config.id.replace(/-/g, '')}Calculator: CalculatorSEO = ${JSON.stringify(exportData, null, 2)};`;
  }

  static analyzeCalculatorPerformance(config: CalculatorSEO): {
    seoScore: number;
    recommendations: string[];
    strengths: string[];
  } {
    let score = 0;
    const recommendations: string[] = [];
    const strengths: string[] = [];

    // Title analysis (20 points)
    if (config.title.length >= 20 && config.title.length <= 60) {
      score += 20;
      strengths.push('Title length is optimal for SEO');
    } else if (config.title.length < 20) {
      score += 10;
      recommendations.push('Consider making the title longer for better SEO');
    } else {
      score += 5;
      recommendations.push('Title might be too long for optimal SEO');
    }

    // Description analysis (20 points)
    if (config.seo.description.length >= 120 && config.seo.description.length <= 160) {
      score += 20;
      strengths.push('Meta description length is perfect');
    } else if (config.seo.description.length < 120) {
      score += 10;
      recommendations.push('Meta description could be longer for better SERP visibility');
    } else {
      score += 10;
      recommendations.push('Meta description might be too long and could be truncated');
    }

    // Keywords analysis (20 points)
    if (config.seo.keywords.length >= 8 && config.seo.keywords.length <= 15) {
      score += 20;
      strengths.push('Good number of targeted keywords');
    } else if (config.seo.keywords.length < 8) {
      score += 10;
      recommendations.push('Add more relevant keywords for better discoverability');
    } else {
      score += 10;
      recommendations.push('Consider reducing keywords to focus on most important ones');
    }

    // Content richness (20 points)
    if (config.explanations) {
      score += 10;
      strengths.push('Includes helpful explanations');
      
      if (config.explanations.examples && config.explanations.examples.length > 0) {
        score += 5;
        strengths.push('Provides practical examples');
      }
      
      if (config.explanations.tips && config.explanations.tips.length > 0) {
        score += 5;
        strengths.push('Includes useful tips');
      }
    } else {
      recommendations.push('Add explanations and examples to improve user experience');
    }

    // Tags and categorization (10 points)
    if (config.tags && config.tags.length >= 3) {
      score += 10;
      strengths.push('Well-tagged for discoverability');
    } else {
      score += 5;
      recommendations.push('Add more relevant tags to improve categorization');
    }

    // Special features (10 points)
    if (config.featured) {
      score += 5;
      strengths.push('Featured calculator for higher visibility');
    }
    if (config.trending) {
      score += 5;
      strengths.push('Trending status boosts discoverability');
    }

    return {
      seoScore: Math.min(score, 100),
      recommendations,
      strengths,
    };
  }
}
