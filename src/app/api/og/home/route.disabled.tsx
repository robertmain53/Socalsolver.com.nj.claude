import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
 try {
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
 padding: 60,
 margin: 40,
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 textAlign: 'center',
 boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
 maxWidth: 900,
 }}
 >
 {/* Logo */}
 <div
 style={{
 width: 120,
 height: 120,
 borderRadius: 60,
 backgroundColor: '#3b82f6',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 marginBottom: 32,
 fontSize: 60,
 background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
 }}
 >
 🧮
 </div>
 
 {/* Title */}
 <div
 style={{
 fontSize: 64,
 fontWeight: 800,
 background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
 backgroundClip: 'text',
 color: 'transparent',
 marginBottom: 20,
 lineHeight: 1.1,
 }}
 >
 Calculator Platform
 </div>
 
 {/* Subtitle */}
 <div
 style={{
 fontSize: 32,
 color: '#6b7280',
 marginBottom: 32,
 lineHeight: 1.3,
 fontWeight: 500,
 }}
 >
 Free Online Calculators for Every Need
 </div>
 
 {/* Features */}
 <div
 style={{
 display: 'flex',
 justifyContent: 'center',
 gap: 40,
 fontSize: 18,
 color: '#374151',
 marginBottom: 24,
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <span style={{ fontSize: 24 }}>⚡</span>
 <span>Instant Results</span>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <span style={{ fontSize: 24 }}>🎯</span>
 <span>100% Accurate</span>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <span style={{ fontSize: 24 }}>📱</span>
 <span>Mobile Friendly</span>
 </div>
 </div>
 
 {/* CTA */}
 <div
 style={{
 backgroundColor: '#3b82f6',
 color: 'white',
 padding: '16px 32px',
 borderRadius: 12,
 fontSize: 22,
 fontWeight: 600,
 }}
 >
 Explore Calculators →
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
 console.error('Failed to generate home OG image:', e);
 return new Response('Failed to generate image', { status: 500 });
 }
}
