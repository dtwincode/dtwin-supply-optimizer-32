import React, { useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryFilterProvider } from "@/components/inventory/InventoryFilterContext";
import { InventoryGlobalFilters } from "@/components/inventory/InventoryGlobalFilters";

// Strategic Planning
import { DecouplingPointManager } from "@/components/inventory/strategic/DecouplingPointManager";
import { SupplyChainNetwork } from "@/components/inventory/strategic/SupplyChainNetwork";

// Bill of Materials
import { BOMViewer } from "@/components/inventory/bom";

// Operational View
import { BufferStatusGrid } from "@/components/inventory/operational/BufferStatusGrid";
import { ExceptionManagement } from "@/components/inventory/advanced/ExceptionManagement";

// Analytics & Insights
import { BufferPerformance } from "@/components/inventory/analytics/BufferPerformance";
import { SKUClassifications } from "@/components/inventory/classification/SKUClassifications";

// Buffer Management
import { BufferProfileManagement } from "@/components/inventory/buffer-profiles";
import { BreachAlertsDashboard } from "@/components/inventory/alerts";

const Inventory: React.FC = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "strategic";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
      searchParams.set("tab", value);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  return (
    <InventoryFilterProvider>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("inventory.inventoryManagement") || "DDMRP Inventory Management"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("inventory.managementDescription") ||
                "Strategic buffer planning and operational execution"}
            </p>
          </div>

          <InventoryGlobalFilters />

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="strategic">Strategic Planning</TabsTrigger>
              <TabsTrigger value="operational">Operational View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
              <TabsTrigger value="buffer-profiles">Buffer Profiles</TabsTrigger>
              <TabsTrigger value="breach-alerts">Breach Alerts</TabsTrigger>
              <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
            </TabsList>

            <TabsContent value="strategic" className="space-y-6">
              <SupplyChainNetwork />
              <DecouplingPointManager />
            </TabsContent>

            <TabsContent value="operational" className="space-y-6">
              <BufferStatusGrid />
              <ExceptionManagement />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <BufferPerformance />
              <SKUClassifications />
            </TabsContent>

            <TabsContent value="buffer-profiles" className="space-y-6">
              <BufferProfileManagement />
            </TabsContent>

            <TabsContent value="breach-alerts" className="space-y-6">
              <BreachAlertsDashboard />
            </TabsContent>

            <TabsContent value="bom" className="space-y-6">
              <BOMViewer />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </InventoryFilterProvider>
  );
};

export default Inventory;
