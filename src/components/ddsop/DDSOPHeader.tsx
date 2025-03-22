
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

  console.log("Rendering DDSOPHeader with language:", language);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Layers className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
              <p className="text-sm text-muted-foreground">{t('description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800">
              {t('compliantMode')}
            </Badge>
            <Button variant="outline" size="sm" className="gap-1">
              <FilterIcon className="h-4 w-4" />
              {t('filters')}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
            <Button size="sm">{t('generateReport')}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
