#!/bin/bash

echo "🌐 Phase 9.5: Scaffolding Website Frontend Structure..."

# Create layout folder if not exists
mkdir -p src/components/layout

# Create Header.tsx
cat << 'EOF' > src/components/layout/Header.tsx
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
EOF

# Create Footer.tsx
cat << 'EOF' > src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full p-4 text-center text-sm text-gray-500 border-t mt-8">
      © 2025 SocalSolver. All rights reserved.
    </footer>
  );
}
EOF

# Create LanguageToggle.tsx
cat << 'EOF' > src/components/layout/LanguageToggle.tsx
'use client';
import { usePathname, useRouter } from 'next/navigation';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (lang: string) => {
    const newPath = '/' + lang + pathname.replace(/^\/[a-z]{2}/, '');
    router.push(newPath);
  };

  return (
    <div className="space-x-2 text-sm">
      <button onClick={() => switchTo('en')}>EN</button>
      <button onClick={() => switchTo('es')}>ES</button>
      <button onClick={() => switchTo('fr')}>FR</button>
    </div>
  );
}
EOF

# Create homepage
mkdir -p src/app/(main)

cat << 'EOF' > src/app/(main)/page.tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LanguageToggle from '@/components/layout/LanguageToggle';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className="p-6">
        <section className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Welcome to SocalSolver</h1>
          <p className="text-lg text-gray-600">Smart calculators for every need.</p>
          <LanguageToggle />
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Popular Categories</h2>
          <ul className="list-disc ml-6">
            <li><Link href="/categories/finance">Finance</Link></li>
            <li><Link href="/categories/health">Health</Link></li>
            <li><Link href="/categories/math">Math</Link></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Top Calculators</h2>
          <ul className="list-disc ml-6">
            <li><Link href="/calculator/loan-payment">Loan Payment</Link></li>
            <li><Link href="/calculator/bmi">BMI</Link></li>
            <li><Link href="/calculator/compound-interest">Compound Interest</Link></li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
EOF

echo "✅ Website scaffolding complete. Homepage + layout components created."
