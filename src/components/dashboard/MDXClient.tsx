'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import dynamic from 'next/dynamic';

// map MDX tags to React components
const components = {
  Challenge: dynamic(() => import('@/components/mdx/Challenge')),
  Test:      dynamic(() => import('@/components/calculators/Test')), // example
};

export default function MDXClient({
  mdx,
}: {
  mdx: MDXRemoteSerializeResult;
}) {
  return <MDXRemote {...mdx} components={components} />;
}
