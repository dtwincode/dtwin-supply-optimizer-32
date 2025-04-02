
import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

interface DDSOPStatusProps {
  status: string;
  variant?: 'default' | 'outline';
}

export const DDSOPStatusBadge = ({ status, variant = 'outline' }: DDSOPStatusProps): ReactNode => {
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
      case 'on-track':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Badge 
      variant={variant} 
      className={getStatusClass(status)}
    >
      {status}
    </Badge>
  );
};

// Add this export for compatibility with old imports
export const getDDSOPStatusBadge = DDSOPStatusBadge;
