import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';
import { CalculatorSEO } from '@/lib/seo';

interface Props {
  calculator: CalculatorSEO;
}

export function CalculatorBreadcrumbs({ calculator }: Props) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link
              href="/calculators"
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
            >
              Calculators
            </Link>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link
              href={`/calculators/category/${calculator.seo.category}`}
              className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 capitalize"
            >
              {calculator.seo.category}
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
              {calculator.title}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
}
