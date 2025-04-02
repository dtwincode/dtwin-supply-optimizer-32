
import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export const StatusBadge = ({ status }: { status: string }) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'good':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'alert':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(getStatusClass(status))}
    >
      {status}
    </Badge>
  );
};

export const getStatusBadge = StatusBadge;

export const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-600" />;
  }
};

export const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
  switch (impact) {
    case 'high':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">High</Badge>;
    case 'medium':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Medium</Badge>;
    case 'low':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Low</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Unknown</Badge>;
  }
};
