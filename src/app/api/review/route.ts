import { reviewContentWithAI } from '@/lib/ai/review';

export const runtime = 'nodejs'; // Ensures fs and other Node APIs are available

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();

    if (!slug || typeof slug !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid slug provided' }), { status: 400 });
    }

    const feedback = await reviewContentWithAI({ slug });

    return Response.json({ feedback });
  } catch (error: any) {
    console.error('AI review failed:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
