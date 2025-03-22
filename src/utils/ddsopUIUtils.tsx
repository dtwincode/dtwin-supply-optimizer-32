
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Language, getTranslation } from '@/translations';

// Shared function to get status badges with consistent styling
export const getStatusBadge = (status: string, language: Language) => {
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;
  
  switch (status) {
    case 'on-track':
      return <Badge className="bg-green-600">{t('onTrack')}</Badge>;
    case 'warning':
      return <Badge className="bg-amber-600">{t('warning')}</Badge>;
    case 'alert':
      return <Badge className="bg-red-600">{t('alert')}</Badge>;
    case 'upcoming':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t('upcoming')}</Badge>;
    case 'standby':
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">{t('standby')}</Badge>;
    case 'pending-action':
      return <Badge className="bg-red-600">{t('pendingAction')}</Badge>;
    case 'in-assessment':
      return <Badge className="bg-amber-600">{t('inAssessment')}</Badge>;
    case 'monitored':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">{t('monitored')}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

// Shared function to get trend icons with consistent styling
export const getTrendIcon = (trend: string, language: Language) => {
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;
  
  switch (trend) {
    case 'improving':
      return <span className="text-green-600 text-xs flex items-center">↑ {t('improving')}</span>;
    case 'declining':
      return <span className="text-red-600 text-xs flex items-center">↓ {t('declining')}</span>;
    case 'stable':
    default:
      return <span className="text-blue-600 text-xs flex items-center">→ {t('stable')}</span>;
  }
};

// Shared function to get impact badges with consistent styling
export const getImpactBadge = (impact: string, language: Language) => {
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;
  
  switch (impact) {
    case 'high':
      return <Badge className="bg-red-600">{t('highImpact')}</Badge>;
    case 'medium':
      return <Badge className="bg-amber-600">{t('mediumImpact')}</Badge>;
    case 'low':
      return <Badge variant="outline" className="bg-green-100 text-green-800">{t('lowImpact')}</Badge>;
    default:
      return <Badge>{impact}</Badge>;
  }
};
