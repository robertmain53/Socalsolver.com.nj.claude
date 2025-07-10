import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'content/status', `${params.slug}.json`);

  try {
    const file = await fs.readFile(filePath, 'utf8');
    return new Response(file, { status: 200 });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      // 👇 Auto-create default metadata if not present
      const defaultStatus = {
        status: 'draft',
        editorNotes: '',
      };
      await fs.writeFile(filePath, JSON.stringify(defaultStatus, null, 2));
      return new Response(JSON.stringify(defaultStatus), { status: 200 });
    } else {
      return new Response('Internal Server Error', { status: 500 });
    }
  }
}
