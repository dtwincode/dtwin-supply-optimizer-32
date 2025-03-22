
import React from 'react';
import { VarianceChart } from '../VarianceChart';
import { ExecutionMetrics } from '../ExecutionMetrics';

export const ChartSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <VarianceChart />
      <ExecutionMetrics />
    </div>
  );
};
