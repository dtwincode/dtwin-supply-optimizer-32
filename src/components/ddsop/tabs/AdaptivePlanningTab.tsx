
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Card, CardContent } from '@/components/ui/card';
import { AdaptivePlanning } from '@/components/ddsop/adaptive/AdaptivePlanning';

export const AdaptivePlanningTab = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.ddsop.${key}`, language) || key;

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t('adaptivePlanning')}</h2>
        <p className="text-muted-foreground mb-6">
          {t('adaptivePlanningDescription')}
        </p>
        
        <AdaptivePlanning />
      </CardContent>
    </Card>
  );
};
