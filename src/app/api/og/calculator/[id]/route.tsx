import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getCalculatorConfig } from '@/lib/calculator/registry';

export const runtime = 'edge';

export async function GET(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
 const calculator = getCalculatorConfig(params.id);
 
 if (!calculator) {
 return new Response('Calculator not found', { status: 404 });
 }

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
 width: 80,
 height: 80,
 borderRadius: 40,
 backgroundColor: '#3b82f6',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 marginBottom: 24,
 fontSize: 40,
 color: 'white',
 }}
 >
 🧮
 </div>
 
 {/* Title */}
 <div
 style={{
 fontSize: 48,
 fontWeight: 700,
 color: '#1f2937',
 marginBottom: 16,
 lineHeight: 1.2,
 }}
 >
 {calculator.title}
 </div>
 
 {/* Description */}
 <div
 style={{
 fontSize: 24,
 color: '#6b7280',
 marginBottom: 24,
 lineHeight: 1.4,
 maxWidth: 600,
 }}
 >
 {calculator.seo.description || calculator.description}
 </div>
 
 {/* Category Badge */}
 <div
 style={{
 display: 'flex',
 alignItems: 'center',
 gap: 16,
 marginBottom: 16,
 }}
 >
 <div
 style={{
 backgroundColor: '#e5e7eb',
 color: '#374151',
 padding: '8px 16px',
 borderRadius: 20,
 fontSize: 16,
 fontWeight: 500,
 textTransform: 'capitalize',
 }}
 >
 {calculator.seo.category}
 </div>
 {calculator.featured && (
 <div
 style={{
 backgroundColor: '#dbeafe',
 color: '#1e40af',
 padding: '8px 16px',
 borderRadius: 20,
 fontSize: 16,
 fontWeight: 500,
 }}
 >
 Featured
 </div>
 )}
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
 console.error('Failed to generate OG image:', e);
 return new Response('Failed to generate image', { status: 500 });
 }
}
