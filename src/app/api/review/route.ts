import { NextRequest, NextResponse } from 'next/server'
import { reviewContentWithAI } from '@/lib/ai/review'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await reviewContentWithAI(body)
  return NextResponse.json(result)
}
