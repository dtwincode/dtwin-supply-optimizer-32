
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { FileBarChart } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// Sample data for the variance chart
const varianceData = [
  { name: 'Week 1', planned: 120, actual: 118, variance: 1.7 },
  { name: 'Week 2', planned: 145, actual: 132, variance: 9.0 },
  { name: 'Week 3', planned: 135, actual: 142, variance: -5.2 },
  { name: 'Week 4', planned: 155, actual: 149, variance: 3.9 },
  { name: 'Week 5', planned: 160, actual: 147, variance: 8.1 },
  { name: 'Week 6', planned: 150, actual: 158, variance: -5.3 },
];

export const DDOMVarianceChart: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.ddom.${key}`, language) || key;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <FileBarChart className="h-5 w-5 mr-2 text-dtwin-medium" />
          {t('planVsActualVariance')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={varianceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'variance') return [`${value}%`, t('variance')];
                  return [value, name === 'planned' ? t('planned') : t('actual')];
                }}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="planned" fill="#8884d8" name={t('planned')} />
              <Bar dataKey="actual" fill="#82ca9d" name={t('actual')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
