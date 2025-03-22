
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DDSOPHeader } from '@/components/ddsop/DDSOPHeader';
import { DDSOPMetricsGrid } from '@/components/ddsop/DDSOPMetricsGrid';
import { DDSOPTabs } from '@/components/ddsop/DDSOPTabs';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import PageLoading from '@/components/PageLoading';

const DDSOP = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary fallback={<div className="p-8 text-center">An error occurred loading the DDSOP module.</div>}>
        <div className="space-y-6 p-6">
          <DDSOPHeader />
          <DDSOPMetricsGrid />
          <DDSOPTabs />
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default DDSOP;
