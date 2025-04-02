
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BufferStatusBadgeProps {
  status: 'critical' | 'warning' | 'normal' | 'excess' | 'red' | 'yellow' | 'green' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const BufferStatusBadge: React.FC<BufferStatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const getStatusClass = () => {
    const statusLower = status.toLowerCase();
    
    switch(statusLower) {
      case 'critical':
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'normal':
      case 'green':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'excess':
      case 'blue':
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
