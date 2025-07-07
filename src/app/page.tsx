import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Calculator Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access hundreds of free, accurate calculators for all your calculation needs.
            Get instant results with step-by-step explanations.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/calculators">
              <Button size="lg">
                Browse Calculators
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" size="lg">
                Search Tools
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
            <p className="text-gray-600">Get calculations in real-time as you type</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">100% Accurate</h3>
            <p className="text-gray-600">All calculators use verified mathematical formulas</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">Works perfectly on all devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
