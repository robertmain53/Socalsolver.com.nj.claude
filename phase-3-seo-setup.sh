#!/bin/bash

echo "🔍 Phase 3: Setting up SEO & E-E-A-T Layer..."

# Create directories
mkdir -p src/lib/seo

# Create generateSEOSchema.ts
cat << 'EOF' > src/lib/seo/generateSEOSchema.ts
export function generateSEOSchema({ title, author, reviewed_by, reviewed_at, slug }: {
  title: string;
  author: string;
  reviewed_by: string;
  reviewed_at: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "author": { "@type": "Person", "name": author },
    "reviewedBy": { "@type": "Person", "name": reviewed_by },
    "dateModified": reviewed_at,
    "url": \`https://socalsolver.com/calculator/\${slug}\`
  };
}
EOF

# Create metaTags.tsx
cat << 'EOF' > src/lib/seo/metaTags.tsx
'use client';
import Head from 'next/head';

export default function MetaTags({ title, description }: { title: string; description: string }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
}
EOF

# Notify user to modify page.tsx
echo "🛠️  Phase 3 files created."
echo "👉 Please modify your calculator page (e.g. src/app/calculator/[slug]/page.tsx) to:"
echo "   - Extract metadata from MDX frontmatter"
echo "   - Call generateSEOSchema()"
echo "   - Inject <script type='application/ld+json'>"

echo "✅ Done. Phase 3 scaffolding complete."
