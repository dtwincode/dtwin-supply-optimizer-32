
import { getDDSOPStatusBadge, getImpactBadge } from '@/components/ddsop/utils/statusUtils';
import { getTrendIcon } from '@/components/ddsop/utils/trendUtils';

// Re-export these functions for use in other components
export { getDDSOPStatusBadge as getStatusBadge, getTrendIcon, getImpactBadge };

/**
 * Calculates a recommendation based on status and trend
 */
export const getRecommendation = (status: string, trend: string) => {
  if (status === 'alert') {
    return 'immediate-action';
  } else if (status === 'warning' && trend === 'declining') {
    return 'preventive-action';
  } else if (status === 'warning' && trend === 'stable') {
    return 'monitoring';
  } else if (status === 'on-track' && trend === 'improving') {
    return 'maintain';
  } else {
    return 'review';
  }
};

/**
 * Formats a date as a readable string
 */
export const formatDDSOPDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Calculates percentage of completion
 */
export const calculateCompletion = (current: number, target: number): number => {
  return Math.min(100, Math.round((current / target) * 100));
};
