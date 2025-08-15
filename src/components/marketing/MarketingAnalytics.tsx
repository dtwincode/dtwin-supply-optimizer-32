
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

// Sample analytics data - in a real app, this would come from an API
const analyticsData = [
  { name: 'Black Friday', roi: 340, impact: 25, acquisition: 82 },
  { name: 'Summer Sale', roi: 290, impact: 18, acquisition: 65 },
  { name: 'Holiday', roi: 320, impact: 22, acquisition: 75 },
  { name: 'Spring Sale', roi: 270, impact: 15, acquisition: 60 },
  { name: 'Clearance', roi: 220, impact: 12, acquisition: 48 },
];

export const MarketingAnalytics = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`marketing.${key}`, language) || key;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {t('campaignPerformance')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex flex-col h-full">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="roi" name={t('roi')} fill="#8884d8" />
                <Bar dataKey="impact" name={t('demandImpact')} fill="#82ca9d" />
                <Bar dataKey="acquisition" name={t('customerAcquisition')} fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center">
              <div className="text-sm font-medium">{t('averageROI')}</div>
              <div className="text-xl font-bold text-purple-600">288%</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{t('avgDemandImpact')}</div>
              <div className="text-xl font-bold text-green-600">18.4%</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{t('conversionRate')}</div>
              <div className="text-xl font-bold text-amber-600">3.2%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
