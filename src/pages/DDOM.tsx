import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExecutionMetrics } from '@/components/ddom/ExecutionMetrics';
import { POExecutionTable } from '@/components/ddom/POExecutionTable';
import { SupplierVarianceChart } from '@/components/ddom/SupplierVarianceChart';

const DDOM: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">DDOM - Demand Driven Operating Model</h1>
        <p className="text-muted-foreground mt-2">
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
  );
};

export default DDOM;
