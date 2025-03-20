
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DDSOPHeader } from '@/components/ddsop/DDSOPHeader';
import { DDSOPMetricsGrid } from '@/components/ddsop/DDSOPMetricsGrid';
import { DDSOPTabs } from '@/components/ddsop/DDSOPTabs';

const DDSOP = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DDSOPHeader />
        <DDSOPMetricsGrid />
        <DDSOPTabs />
      </div>
    </DashboardLayout>
  );
};

export default DDSOP;
