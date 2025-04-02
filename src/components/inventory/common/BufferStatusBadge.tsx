
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BufferStatusBadgeProps {
  status: 'green' | 'yellow' | 'red';
  className?: string;
}

export const BufferStatusBadge = ({ status, className = '' }: BufferStatusBadgeProps) => {
  if (status === 'green') {
    return (
      <Badge variant="outline" className={`bg-green-100 text-green-800 border-green-300 ${className}`}>
        Healthy
      </Badge>
    );
  }
  
  if (status === 'yellow') {
    return (
      <Badge variant="outline" className={`bg-yellow-100 text-yellow-800 border-yellow-300 ${className}`}>
        Warning
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className={`bg-red-100 text-red-800 border-red-300 ${className}`}>
      Critical
    </Badge>
  );
};
