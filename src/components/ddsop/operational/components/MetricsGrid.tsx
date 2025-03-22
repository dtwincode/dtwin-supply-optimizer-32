
import React from 'react';
import { MetricCard } from './MetricCard';

interface MetricsGridProps {
  metrics: Array<{
    id: string;
    name: string;
    status: string;
    value: number | string;
    target?: number;
    unit?: string;
  }>;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};
