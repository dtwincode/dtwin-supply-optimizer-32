
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { BarChart as BarChartIcon } from 'lucide-react';

// Sample data for variance chart
const data = [
  { name: 'Week 1', plan: 150, actual: 120, variance: -30 },
  { name: 'Week 2', plan: 160, actual: 155, variance: -5 },
  { name: 'Week 3', plan: 170, actual: 180, variance: 10 },
  { name: 'Week 4', plan: 180, actual: 165, variance: -15 },
  { name: 'Week 5', plan: 190, actual: 205, variance: 15 },
  { name: 'Week 6', plan: 200, actual: 182, variance: -18 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const VarianceChart: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;

  console.log("Rendering VarianceChart");

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">{`${t('planned')}: ${payload[0].value}`}</p>
          <p className="text-green-600">{`${t('actual')}: ${payload[1].value}`}</p>
          <p className={`font-medium ${payload[2]?.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {`${t('variance')}: ${payload[2]?.value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <BarChartIcon className="h-5 w-5 mr-2 text-dtwin-medium" />
          {t('planVsActual')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="plan" fill="#3b82f6" name={t('planned')} />
              <Bar dataKey="actual" fill="#22c55e" name={t('actual')} />
              <Bar 
                dataKey="variance" 
                fill="#f43f5e" 
                name={t('variance')} 
                hide={true} // Hide from chart but keep in tooltip
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
