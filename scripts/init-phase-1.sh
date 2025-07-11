# scripts/init-phase-1.sh

# 1. Create /api/improve and /api/review routes (server functions)
mkdir -p src/app/api/{improve,review}
cat <<'EOF' > src/app/api/improve/route.ts
import { improveContent } from '@/lib/ai/improve'
export const runtime = 'nodejs'
export async function POST(req: Request) {
  const { slug, content } = await req.json()
  const improved = await improveContent(slug, content)
  return Response.json({ improved })
}
EOF

# 2. Create library stub
mkdir -p src/lib/ai
cat <<'EOF' > src/lib/ai/improve.ts
export async function improveContent(slug: string, content: string) {
  return content + "\n\n<!-- Improved by AI -->"
}
EOF

# 3. Create /logs dir
mkdir -p logs/improve
echo "// logs of AI actions go here" > logs/improve/.gitkeep

# 4. (Optional) Add example button to EditorClient.tsx for testing
echo 'TODO: Add <button onClick={runImprove}>Run AI Improve</button>' >> src/components/dashboard/EditorClient.tsx

echo "✅ Phase 1 scaffolded: /api/improve is ready."
