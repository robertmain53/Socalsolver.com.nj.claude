import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const { slug, ...rest } = await req.json()
  const file = path.join(process.cwd(), 'content/status', `${slug}.json`)
  await fs.writeFile(file, JSON.stringify(rest, null, 2))
  return NextResponse.json({ ok: true })
}
