// scripts/generate-zod-schema.js
const fs = require('fs');
const path = require('path');

const content = `
import { z } from 'zod';

export const VariableDefinitionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  unit: z.string().optional(),
  type: z.enum(["number", "date", "currency", "select", "percentage"]),
  defaultValue: z.union([z.string(), z.number()]).optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  validation: z.string().optional()
});

export type VariableDefinition = z.infer<typeof VariableDefinitionSchema>;
`;

const outputPath = path.join(__dirname, '../src/types/zod-schema.ts');
fs.writeFileSync(outputPath, content.trim() + '\n');
console.log(`✅ Zod schema written to ${outputPath}`);
