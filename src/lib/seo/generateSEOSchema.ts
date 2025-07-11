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
