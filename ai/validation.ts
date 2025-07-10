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
