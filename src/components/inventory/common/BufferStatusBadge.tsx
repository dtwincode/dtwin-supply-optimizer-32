
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/contexts/I18nContext';

type BufferStatus = 'critical' | 'low' | 'medium' | 'good' | 'excess';

interface BufferStatusBadgeProps {
  status: BufferStatus;
  className?: string;
}

export const BufferStatusBadge: React.FC<BufferStatusBadgeProps> = ({ status, className }) => {
  const { t } = useI18n();

  const getStatusColor = (status: BufferStatus) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'low':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'good':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'excess':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: BufferStatus) => {
    switch (status) {
      case 'critical':
        return t('inventory.bufferStatus.critical') || 'Critical';
      case 'low':
        return t('inventory.bufferStatus.low') || 'Low';
      case 'medium':
        return t('inventory.bufferStatus.medium') || 'Medium';
      case 'good':
        return t('inventory.bufferStatus.good') || 'Good';
      case 'excess':
        return t('inventory.bufferStatus.excess') || 'Excess';
      default:
        return t('inventory.bufferStatus.unknown') || 'Unknown';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusColor(status)} ${className || ''}`}
    >
      {getStatusText(status)}
    </Badge>
  );
};
