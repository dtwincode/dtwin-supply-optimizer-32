
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Card, CardContent } from '@/components/ui/card';

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
        
        {/* This is where we'll move the DDOMAdaptivePlanning component content in a future update */}
        <div className="flex items-center justify-center h-64 bg-slate-50 rounded-md border border-dashed border-slate-200">
          <p className="text-muted-foreground">
            {t('adaptiveMetrics')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
