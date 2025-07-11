#!/bin/bash

set -e
echo "🛠️  Starting Phase 1: Improve API + Diff Engine + Diagnostics..."

# 1. Ensure OpenAI/AI dependencies
echo "📦 Installing AI & diff dependencies..."
npm install openai fast-diff

# 2. Create /api/improve/route.ts
mkdir -p src/app/api/improve
cat <<'EOF' > src/app/api/improve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { improveContentWithAI } from '@/lib/ai/improve';
import { diffLines } from 'diff';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { slug, content } = await req.json();

  const improved = await improveContentWithAI({ slug, content });

  const diff = diffLines(content, improved);
  return NextResponse.json({ improved, diff });
}
EOF

# 3. Create /lib/ai/improve.ts
mkdir -p src/lib/ai
cat <<'EOF' > src/lib/ai/improve.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function improveContentWithAI({ slug, content }: { slug: string, content: string }) {
  const prompt = `You are a calculator content editor. Improve the following educational content for clarity, tone, and structure.\n\n---\n\n${content}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful AI content editor.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content || content;
}
EOF

# 4. Add a test script
mkdir -p test
cat <<'EOF' > test/improve-api.test.js
const fetch = require('node-fetch');

(async () => {
  console.log("🧪 Testing /api/improve...");
  const response = await fetch('http://localhost:3000/api/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug: 'test', content: '# Example Content\n\nExplain this clearly.' })
  });

  const data = await response.json();
  if (!data.improved || !data.diff) {
    console.error("❌ /api/improve test failed.");
    process.exit(1);
  }
  console.log("✅ /api/improve test passed.");
})();
EOF

# 5. Add test command to package.json
echo "🛠️  Adding test:api script to package.json..."
npx json -I -f package.json -e 'this.scripts["test:api"]="node test/improve-api.test.js"'

# 6. Final diagnostics
echo "🏁 Final test: rebuilding and running diagnostic..."

npm run build || (echo "❌ Build failed" && exit 1)

echo "✅ Build passed."

echo "ℹ️  Now run the dev server in one terminal:"
echo "   npm run dev"
echo "📥 Then in another, test the API with:"
echo "   npm run test:api"

echo "🎉 Phase 1 setup complete!"
