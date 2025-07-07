import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Calculator {
  id: string;
  title: string;
  description: string;
  category: string;
  featured?: boolean;
  trending?: boolean;
  tags?: string[];
  seo: {
    description: string;
    difficulty: string;
    category: string;
  };
}

interface Props {
  calculators: Calculator[];
  showCategory?: boolean;
}

export function CalculatorGrid({ calculators, showCategory = false }: Props) {
  if (calculators.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No calculators found</div>
        <div className="text-gray-400">Try adjusting your search or browse our categories</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {calculators.map((calculator) => (
        <Link
          key={calculator.id}
          href={`/calculators/${calculator.id}`}
          className="group"
        >
          <Card className="h-full hover:shadow-lg transition-shadow border-gray-200 group-hover:border-blue-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                  {calculator.title}
                </CardTitle>
                <div className="flex flex-col gap-1 ml-2">
                  {calculator.featured && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      Featured
                    </Badge>
                  )}
                  {calculator.trending && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Trending
                    </Badge>
                  )}
                </div>
              </div>
              
              {showCategory && (
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {calculator.category}
                  </Badge>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {calculator.seo.description || calculator.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="capitalize">{calculator.seo.difficulty}</span>
                  <span>•</span>
                  <span>{calculator.seo.category}</span>
                </div>
                <span className="group-hover:text-blue-600 transition-colors">
                  Calculate →
                </span>
              </div>
              
              {calculator.tags && calculator.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {calculator.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                  {calculator.tags.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{calculator.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
