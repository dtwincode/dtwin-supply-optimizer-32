
import React, { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DDSOPHeader } from '@/components/ddsop/DDSOPHeader';
import { DDSOPMetricsGrid } from '@/components/ddsop/DDSOPMetricsGrid';
import { DDSOPTabs } from '@/components/ddsop/DDSOPTabs';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import PageLoading from '@/components/PageLoading';

const DDSOP = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <div className="space-y-6 p-6">
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
