
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { ddomMetrics } from '@/data/ddsopMetricsData';
import { MetricsGrid } from './components/MetricsGrid';
import { ChartSection } from './components/ChartSection';

export const OperationalDashboard: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;

  return (
    <div className="space-y-6">
      <MetricsGrid metrics={ddomMetrics} />
      <ChartSection />
    </div>
  );
};
