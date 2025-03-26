
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
    trend?: string;
  }>;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
  );
};
