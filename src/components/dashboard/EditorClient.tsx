import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import MDXComponents from '@/components/MDXComponents';
import { MDXRemote } from 'next-mdx-remote'; // ✅ NOT /rsc

export default function EditorClient({
  slug,
  initialContent,
  initialStatus,
}: {
  slug: string;
  initialContent: MDXRemoteSerializeResult;
  initialStatus: any;
}) {
  return (
    <div>
      <h1>✍️ Editing: {slug}</h1>
      <MDXRemote {...initialContent} components={MDXComponents} />
    </div>
  );
}
TODO: Add <button onClick={runImprove}>Run AI Improve</button>
