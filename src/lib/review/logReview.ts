export async function logReview({ slug, approved }: { slug: string, approved: boolean }) {
  console.log(`[REVIEW LOG] ${slug} → ${approved ? 'APPROVED' : 'REJECTED'}`);
  // TODO: Write to file or DB later
}
