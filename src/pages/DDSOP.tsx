
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DDSOPHeader } from '@/components/ddsop/DDSOPHeader';
import { DDSOPMetricsGrid } from '@/components/ddsop/DDSOPMetricsGrid';
import { DDSOPTabs } from '@/components/ddsop/DDSOPTabs';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import PageLoading from '@/components/PageLoading';
import { toast } from 'sonner';

const DDSOP = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading to ensure components have time to mount properly
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("DDSOP page loaded");
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageLoading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ErrorBoundary 
        fallback={<div className="p-8 text-center">An error occurred loading the DDSOP module.</div>}
        onError={(error) => {
          console.error("DDSOP Error:", error);
          toast.error("Error loading DDSOP module");
        }}
      >
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
