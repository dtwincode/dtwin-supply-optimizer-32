
import { Badge } from '@/components/ui/badge';
import React from 'react';

/**
 * Returns a styled Badge component based on the provided status
 */
export const getDDSOPStatusBadge = (status: string, language: string) => {
  switch (status) {
    case 'on-track':
      return (
        <Badge className="bg-green-600">
          {language === 'en' ? 'On Track' : 'على المسار الصحيح'}
        </Badge>
      );
    case 'warning':
      return (
        <Badge className="bg-amber-600">
          {language === 'en' ? 'Warning' : 'تحذير'}
        </Badge>
      );
    case 'alert':
      return (
        <Badge className="bg-red-600">
          {language === 'en' ? 'Alert' : 'تنبيه'}
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-blue-600">
          {language === 'en' ? 'Pending' : 'معلق'}
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-green-600">
          {language === 'en' ? 'Completed' : 'مكتمل'}
        </Badge>
      );
    case 'upcoming':
      return (
        <Badge className="bg-purple-600">
          {language === 'en' ? 'Upcoming' : 'قادم'}
        </Badge>
      );
    case 'standby':
      return (
        <Badge className="bg-gray-600">
          {language === 'en' ? 'On Standby' : 'في الانتظار'}
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

/**
 * Returns a styled Badge component for impact levels
 */
export const getImpactBadge = (impact: string, language: string) => {
  switch (impact) {
    case 'high':
      return (
        <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">
          {language === 'en' ? 'High Impact' : 'تأثير مرتفع'}
        </Badge>
      );
    case 'medium':
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50">
          {language === 'en' ? 'Medium Impact' : 'تأثير متوسط'}
        </Badge>
      );
    case 'low':
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">
          {language === 'en' ? 'Low Impact' : 'تأثير منخفض'}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {impact}
        </Badge>
      );
  }
};
