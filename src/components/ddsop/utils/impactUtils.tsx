
import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

export const getImpactBadge = (impact: 'high' | 'medium' | 'low'): ReactNode => {
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
