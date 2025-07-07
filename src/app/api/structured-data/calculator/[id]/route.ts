import { NextRequest, NextResponse } from 'next/server';
import { getCalculatorConfig } from '@/lib/calculator/registry';
import { StructuredDataGenerator } from '@/lib/seo';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const calculator = getCalculatorConfig(params.id);
    
    if (!calculator) {
      return NextResponse.json({ error: 'Calculator not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourcalculator.com';
    const structuredData = StructuredDataGenerator.generateCalculatorStructuredData(
      calculator,
      baseUrl
    );

    return NextResponse.json(structuredData, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Failed to generate structured data:', error);
    return NextResponse.json(
      { error: 'Failed to generate structured data' },
      { status: 500 }
    );
  }
}
