import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const slug = formData.get('slug')?.toString();

  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const statusPath = path.join(process.cwd(), 'content/status', `${slug}.json`);
  const now = new Date().toISOString();

  const status = {
    status: 'approved',
    reviewedBy: 'Editor Name',
    reviewDate: now,
    lastUpdated: now,
  };

  await fs.writeFile(statusPath, JSON.stringify(status, null, 2));

  return NextResponse.redirect(`/dashboard/review`, 303);
}
