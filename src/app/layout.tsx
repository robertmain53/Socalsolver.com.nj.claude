import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/global.css'
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
 title: 'Calculator Platform - Smart Learning Tools',
 description: 'Advanced calculators with AI-powered learning content',
 keywords: ['calculator', 'math', 'learning', 'education', 'tools'],
}

export default function RootLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return (
 <html lang="en">
 <body className={inter.className}>{children}</body>
 </html>
 )
}
