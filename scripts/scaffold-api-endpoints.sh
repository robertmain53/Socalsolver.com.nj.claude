#!/bin/bash

mkdir -p pages/api
mkdir -p ai

# Shared Zod validation schema
cat <<EOF > ai/validation.ts
import { z } from "zod";

export const slugSchema = z.object({
  slug: z.string().min(1)
});

export const improveSchema = slugSchema.extend({
  section: z.enum(["explain", "learn", "challenge"]),
  draft: z.string().min(1),
  notes: z.string().optional()
});

export const translateSchema = slugSchema.extend({
  locale: z.enum(["en", "it", "es", "fr"])
});
EOF

# API Endpoint: /api/improve
cat <<EOF > pages/api/improve.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { improveSchema } from "@/ai/validation";
import { improveSection } from "@/ai/pipeline";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = improveSchema.parse(req.body);
    const result = await improveSection(data.slug, data.section, data.draft, data.notes);
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
}
EOF

# API Endpoint: /api/review
cat <<EOF > pages/api/review.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { slugSchema } from "@/ai/validation";
import { reviewContent } from "@/ai/pipeline";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = slugSchema.parse(req.body);
    const result = await reviewContent(slug);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}
EOF

# API Endpoint: /api/approve
cat <<EOF > pages/api/approve.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { slugSchema } from "@/ai/validation";
import { approveContent } from "@/ai/pipeline";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = slugSchema.parse(req.body);
    const result = await approveContent(slug);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}
EOF

# API Endpoint: /api/publish
cat <<EOF > pages/api/publish.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { slugSchema } from "@/ai/validation";
import { publishContent } from "@/ai/pipeline";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug } = slugSchema.parse(req.body);
    const result = await publishContent(slug);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}
EOF

# API Endpoint: /api/translate-challenge
cat <<EOF > pages/api/translate-challenge.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { translateSchema } from "@/ai/validation";
import { translateChallenge } from "@/ai/pipeline";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug, locale } = translateSchema.parse(req.body);
    const result = await translateChallenge(slug, locale);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}
EOF

echo "✅ AI API endpoints scaffolded successfully."
