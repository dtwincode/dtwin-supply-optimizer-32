import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExecutionMetrics } from '@/components/ddom/ExecutionMetrics';
import { POExecutionTable } from '@/components/ddom/POExecutionTable';
import { SupplierVarianceChart } from '@/components/ddom/SupplierVarianceChart';

const DDOM: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DDOM - Demand Driven Operating Model</h1>
          <p className="text-muted-foreground">
            Operational execution layer for procurement and supplier management
          </p>
        </div>

        <ExecutionMetrics />

        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Execution Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <POExecutionTable />
          </CardContent>
        </Card>

        <SupplierVarianceChart />
      </div>
    </DashboardLayout>
  );
};

export default DDOM;
