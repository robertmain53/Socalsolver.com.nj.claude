import { logReview } from '@/lib/review/logReview';

export async function POST(req: Request) {
  const data = await req.json();
  await logReview(data);
  return new Response(JSON.stringify({ ok: true }));
}
