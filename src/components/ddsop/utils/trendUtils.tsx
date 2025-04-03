
import React from 'react';

/**
 * Returns a styled trend indicator based on the trend direction
 */
export const getTrendIcon = (trend: string, language: string) => {
  switch (trend) {
    case 'improving':
      return (
        <span className="text-green-600 text-xs flex items-center">
          ↑ {language === 'en' ? 'Improving' : 'في تحسن'}
        </span>
      );
    case 'declining':
      return (
        <span className="text-red-600 text-xs flex items-center">
          ↓ {language === 'en' ? 'Declining' : 'في تراجع'}
        </span>
      );
    case 'stable':
    default:
      return (
        <span className="text-blue-600 text-xs flex items-center">
          → {language === 'en' ? 'Stable' : 'مستقر'}
        </span>
      );
  }
};
