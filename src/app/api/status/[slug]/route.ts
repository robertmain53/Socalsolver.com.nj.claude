import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const file = path.join(process.cwd(), 'content/status', `${params.slug}.json`)
  const data = await fs.readFile(file, 'utf-8')
  return NextResponse.json(JSON.parse(data))
}
