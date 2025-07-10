// src/app/dashboard/status/page.tsx
import fs from 'fs/promises';
import path from 'path';

export default async function DashboardStatusPage() {
  const dir = path.join(process.cwd(), 'content/status');
  const files = await fs.readdir(dir);

  const rows = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace('.json', '');
      const json = await fs.readFile(path.join(dir, file), 'utf8');
      const data = JSON.parse(json);
      return { slug, ...data };
    })
  );

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">📊 Calculator Status Overview</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Slug</th>
            <th className="p-2">Status</th>
            <th className="p-2">Last Updated</th>
            <th className="p-2">Reviewer</th>
            <th className="p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.slug} className="border-t">
              <td className="p-2">{row.slug}</td>
              <td className="p-2">{row.status}</td>
              <td className="p-2">{row.lastUpdated}</td>
              <td className="p-2">{row.reviewedBy || '—'}</td>
              <td className="p-2">{row.editorNotes || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
