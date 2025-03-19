
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { LogisticsHeader } from '@/components/logistics/LogisticsHeader';
import { LogisticsMetricsGrid } from '@/components/logistics/metrics/LogisticsMetricsGrid';
import { LogisticsTabs } from '@/components/logistics/LogisticsTabs';

const Logistics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <LogisticsHeader />
        <LogisticsMetricsGrid />
        <LogisticsTabs />
      </div>
    </DashboardLayout>
  );
};

export default Logistics;
