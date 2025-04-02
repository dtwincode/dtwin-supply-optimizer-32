import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Language } from '@/translations/types';

interface StatusProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'processing' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge = ({ status, size = 'md', className }: StatusProps): ReactNode => {
  let badgeText = status;
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";

  switch (status) {
    case 'active':
      badgeVariant = 'outline';
      break;
    case 'inactive':
      badgeVariant = 'secondary';
      break;
    case 'pending':
      badgeVariant = 'default';
      break;
    case 'completed':
      badgeVariant = 'outline';
      break;
    case 'processing':
      badgeVariant = 'default';
      break;
    default:
      badgeVariant = 'outline';
      break;
  }

  return (
    <Badge variant={badgeVariant} className={cn(className, {
      'text-xs': size === 'sm',
      'text-sm': size === 'md',
      'text-base': size === 'lg',
    })}>
      {badgeText}
    </Badge>
  );
};
