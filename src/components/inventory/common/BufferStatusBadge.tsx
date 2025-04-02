
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BufferStatusBadgeProps {
  status: 'critical' | 'warning' | 'normal' | 'excess' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const BufferStatusBadge: React.FC<BufferStatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const getStatusClass = () => {
    switch(status.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'excess':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusClass()} ${
        size === 'sm' ? 'text-xs' : 
        size === 'lg' ? 'text-base' : 
        'text-sm'
      }`}
    >
      {status}
    </Badge>
  );
};
