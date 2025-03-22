
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DDSOPHeader } from '@/components/ddsop/DDSOPHeader';
import { DDSOPMetricsGrid } from '@/components/ddsop/DDSOPMetricsGrid';
import { DDSOPTabs } from '@/components/ddsop/DDSOPTabs';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const DDSOP = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary>
        <div className="space-y-6">
          <DDSOPHeader />
          <DDSOPMetricsGrid />
          <DDSOPTabs />
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default DDSOP;
