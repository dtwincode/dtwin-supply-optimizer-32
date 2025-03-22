
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Zap } from 'lucide-react';
import { getStatusBadge, getTrendIcon } from '@/utils/ddsopUIUtils';
import { executionItems } from '@/data/ddsopMetricsData';

export const ExecutionMetrics: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2 text-dtwin-medium" />
          {t('executionMetrics')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[300px]">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2 font-medium text-muted-foreground">{t('metric')}</th>
                <th className="pb-2 font-medium text-muted-foreground">{t('status')}</th>
                <th className="pb-2 font-medium text-muted-foreground">{t('actual')}</th>
                <th className="pb-2 font-medium text-muted-foreground">{t('target')}</th>
                <th className="pb-2 font-medium text-muted-foreground">{t('trend')}</th>
              </tr>
            </thead>
            <tbody>
              {executionItems.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 text-sm">{t(item.name.toLowerCase().replace(/\s+/g, ''))}</td>
                  <td className="py-3">{getStatusBadge(item.status, language)}</td>
                  <td className="py-3 text-sm font-medium">{item.metric}</td>
                  <td className="py-3 text-sm text-muted-foreground">{item.target}</td>
                  <td className="py-3">{getTrendIcon(item.trend, language)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
