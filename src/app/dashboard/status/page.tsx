// Server Component — page.tsx
import { readFile } from 'fs/promises';
import path from 'path';
import StatusTable from '@/components/dashboard/StatusTable';

export default async function StatusPage() {
  const file = await readFile(path.join(process.cwd(), 'content/status.json'), 'utf-8');
  const rows = JSON.parse(file);

  return (
    <div className="max-w-screen-xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">📊 Calculator Status Dashboard</h1>
      <StatusTable rows={rows} />
    </div>
  );
}
