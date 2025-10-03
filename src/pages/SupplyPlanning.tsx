import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReplenishmentOrders from "@/components/supply-planning/ReplenishmentOrders";
import PurchaseOrderPipeline from "@/components/supply-planning/PurchaseOrderPipeline";
import { ExecutionMetrics } from "@/components/ddom/ExecutionMetrics";
import { POExecutionTable } from "@/components/ddom/POExecutionTable";
import { SupplierVarianceChart } from "@/components/ddom/SupplierVarianceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SupplyPlanning: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "replenishment");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supply Planning</h1>
          <p className="text-muted-foreground">
            Review and manage replenishment orders, approve purchase orders, and track execution performance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList>
            <TabsTrigger value="replenishment">Replenishment Orders</TabsTrigger>
            <TabsTrigger value="pipeline">PO Pipeline</TabsTrigger>
            <TabsTrigger value="execution">Execution Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="replenishment" className="space-y-6">
            <ReplenishmentOrders />
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <PurchaseOrderPipeline />
          </TabsContent>

          <TabsContent value="execution" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SupplyPlanning;
