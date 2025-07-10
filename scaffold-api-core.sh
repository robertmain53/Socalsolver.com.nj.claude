#!/bin/bash

echo "🔧 Scaffolding core API routes..."

mkdir -p src/app/api/improve
mkdir -p src/app/api/review
mkdir -p src/app/api/status
mkdir -p src/app/api/status/update

# Improve Route
cat <<EOF > src/app/api/improve/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { improveContentWithAI } from '@/lib/ai/improve'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await improveContentWithAI(body)
  return NextResponse.json(result)
}
EOF

# Review Route
cat <<EOF > src/app/api/review/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { reviewContentWithAI } from '@/lib/ai/review'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await reviewContentWithAI(body)
  return NextResponse.json(result)
}
EOF

# Status GET
cat <<EOF > src/app/api/status/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  const file = path.join(process.cwd(), 'content/status', \`\${params.slug}.json\`)
  const data = await fs.readFile(file, 'utf-8')
  return NextResponse.json(JSON.parse(data))
}
EOF

# Status UPDATE
cat <<EOF > src/app/api/status/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const { slug, ...rest } = await req.json()
  const file = path.join(process.cwd(), 'content/status', \`\${slug}.json\`)
  await fs.writeFile(file, JSON.stringify(rest, null, 2))
  return NextResponse.json({ ok: true })
}
EOF

echo "✅ API routes scaffolded: improve, review, status"
