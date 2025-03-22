
import React, { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DDSOPHeader } from '@/components/ddsop/DDSOPHeader';
import { DDSOPMetricsGrid } from '@/components/ddsop/DDSOPMetricsGrid';
import { DDSOPTabs } from '@/components/ddsop/DDSOPTabs';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const DDSOP = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary>
        <Suspense fallback={<div className="p-8 text-center">Loading DDSOP module...</div>}>
          <div className="space-y-6">
            <DDSOPHeader />
            <DDSOPMetricsGrid />
            <DDSOPTabs />
          </div>
        </Suspense>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default DDSOP;
