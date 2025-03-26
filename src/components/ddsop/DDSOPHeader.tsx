
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Layers, ChevronDownIcon, FilterIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const DDSOPHeader = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.ddsop.${key}`, language) || key;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-full">
              <Layers className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t('title')}</h1>
              <p className="text-xs text-muted-foreground">{t('description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 text-xs">
              {t('compliantMode')}
            </Badge>
            <Button variant="outline" size="sm" className="gap-1 text-xs h-8">
              <FilterIcon className="h-3 w-3" />
              {t('filters')}
              <ChevronDownIcon className="h-3 w-3" />
            </Button>
            <Button size="sm" className="text-xs h-8">{t('generateReport')}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
