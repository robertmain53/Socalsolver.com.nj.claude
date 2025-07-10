import { NextRequest, NextResponse } from 'next/server'
import { improveContentWithAI } from '@/lib/ai/improve'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await improveContentWithAI(body)
  return NextResponse.json(result)
}
