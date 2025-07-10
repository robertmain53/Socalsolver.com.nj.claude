import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getCalculatorsByCategory } from '@/lib/calculator/registry';

export const runtime = 'edge';

export async function GET(
 request: NextRequest,
 { params }: { params: { category: string } }
) {
 try {
 const category = params.category;
 const calculators = getCalculatorsByCategory(category);
 
 if (calculators.length === 0) {
 return new Response('Category not found', { status: 404 });
 }

 const categoryIcons: Record<string, string> = {
 finance: '💰',
 health: '🏥',
 math: '📊',
 science: '🔬',
 engineering: '⚙️',
 conversion: '🔄',
 };

 return new ImageResponse(
 (
 <div
 style={{
 height: '100%',
 width: '100%',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 backgroundColor: '#f8fafc',
 backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 fontSize: 32,
 fontWeight: 600,
 }}
 >
 <div
 style={{
 backgroundColor: 'white',
 borderRadius: 16,
 padding: 40,
 margin: 40,
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 textAlign: 'center',
 boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
 maxWidth: 800,
 }}
 >
 {/* Icon */}
 <div
 style={{
 width: 100,
 height: 100,
 borderRadius: 50,
 backgroundColor: '#3b82f6',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 marginBottom: 24,
 fontSize: 50,
 }}
 >
 {categoryIcons[category] || '🧮'}
 </div>
 
 {/* Title */}
 <div
 style={{
 fontSize: 52,
 fontWeight: 700,
 color: '#1f2937',
 marginBottom: 16,
 lineHeight: 1.2,
 textTransform: 'capitalize',
 }}
 >
 {category} Calculators
 </div>
 
 {/* Stats */}
 <div
 style={{
 fontSize: 28,
 color: '#6b7280',
 marginBottom: 24,
 lineHeight: 1.4,
 }}
 >
 {calculators.length} Free Online Tools
 </div>
 
 {/* Features */}
 <div
 style={{
 display: 'flex',
 flexDirection: 'column',
 gap: 8,
 fontSize: 20,
 color: '#374151',
 marginBottom: 24,
 }}
 >
 <div>✓ Instant Accurate Results</div>
 <div>✓ Step-by-Step Explanations</div>
 <div>✓ Mobile Friendly Design</div>
 </div>
 
 {/* Brand */}
 <div
 style={{
 fontSize: 18,
 color: '#9ca3af',
 fontWeight: 500,
 }}
 >
 Calculator Platform
 </div>
 </div>
 </div>
 ),
 {
 width: 1200,
 height: 630,
 }
 );
 } catch (e) {
 console.error('Failed to generate category OG image:', e);
 return new Response('Failed to generate image', { status: 500 });
 }
}
