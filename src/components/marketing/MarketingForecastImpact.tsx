
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

// Sample data showing forecast with and without marketing campaigns
const forecastData = [
  { month: 'Jan', baseline: 1000, withCampaigns: 1050 },
  { month: 'Feb', baseline: 980, withCampaigns: 1100 },
  { month: 'Mar', baseline: 1100, withCampaigns: 1250 },
  { month: 'Apr', baseline: 900, withCampaigns: 1180 },
  { month: 'May', baseline: 950, withCampaigns: 1000 },
  { month: 'Jun', baseline: 1050, withCampaigns: 1250 },
  { month: 'Jul', baseline: 1150, withCampaigns: 1400 },
  { month: 'Aug', baseline: 1100, withCampaigns: 1300 },
  { month: 'Sep', baseline: 1050, withCampaigns: 1200 },
  { month: 'Oct', baseline: 1000, withCampaigns: 1100 },
  { month: 'Nov', baseline: 1200, withCampaigns: 1650 },
  { month: 'Dec', baseline: 1500, withCampaigns: 2000 },
];

export const MarketingForecastImpact = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`marketing.${key}`, language) || key;

  // Calculate average uplift
  const avgUplift = Math.round(
    forecastData.reduce((sum, item) => 
      sum + ((item.withCampaigns - item.baseline) / item.baseline * 100), 0
    ) / forecastData.length
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {t('forecastImpact')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={forecastData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                name={t('baselineForecast')} 
                stroke="#8884d8" 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="withCampaigns" 
                name={t('withCampaigns')} 
                stroke="#82ca9d" 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-blue-50 p-2 rounded-md mt-3">
          <div className="text-sm font-medium text-blue-800">{t('averageUplift')}</div>
          <div className="text-lg font-bold text-blue-800">{avgUplift}%</div>
          <p className="text-xs text-blue-600 mt-1">
            {t('campaignForecastDescription')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
