
import { ReactNode } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export const getTrendIcon = (trend: 'up' | 'down' | 'neutral'): ReactNode => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-600" />;
  }
};

export const getTrendLabel = (trend: string, language: string = 'en'): string => {
  if (language === 'ar') {
    switch (trend) {
      case 'improving':
        return 'في تحسن';
      case 'declining':
        return 'في تراجع';
      case 'stable':
        return 'مستقر';
      default:
        return trend;
    }
  }
  
  return trend;
};
