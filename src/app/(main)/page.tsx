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