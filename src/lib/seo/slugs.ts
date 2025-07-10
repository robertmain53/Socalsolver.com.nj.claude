export class SlugGenerator {
 static createSlug(text: string): string {
 return text
 .toLowerCase()
 .trim()
 .replace(/[^\w\s-]/g, '') // Remove special characters
 .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
 .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
 }

 static createCalculatorSlug(title: string, category?: string): string {
 const baseSlug = this.createSlug(title);
 
 // Remove common calculator words to make URLs cleaner
 const cleanSlug = baseSlug
 .replace(/^(calculator|calc|tool)-?/, '')
 .replace(/-?(calculator|calc|tool)$/, '');
 
 return cleanSlug || baseSlug;
 }

 static createCategorySlug(category: string): string {
 return this.createSlug(category);
 }

 static validateSlug(slug: string): boolean {
 // Check if slug is valid (no special characters, not empty, reasonable length)
 return /^[a-z0-9-]+$/.test(slug) && slug.length > 0 && slug.length <= 100;
 }

 static generateAlternativeSlug(baseSlug: string, existingSlugs: string[]): string {
 if (!existingSlugs.includes(baseSlug)) {
 return baseSlug;
 }

 let counter = 1;
 let newSlug = `${baseSlug}-${counter}`;
 
 while (existingSlugs.includes(newSlug)) {
 counter++;
 newSlug = `${baseSlug}-${counter}`;
 }
 
 return newSlug;
 }
}
