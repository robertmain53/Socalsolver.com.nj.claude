'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full p-4 shadow-md flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">SocalSolver</Link>
      <nav className="space-x-4">
        <Link href="/calculators">Calculators</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
