import React, { useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BufferManagementDashboard } from "@/components/inventory/buffer/BufferManagementDashboard";
import { SKUClassifications } from "@/components/inventory/classification/SKUClassifications";
import { DecouplingPointContent } from "@/components/inventory/decoupling/DecouplingPointContent";
import { InventoryOverview } from "@/components/inventory/overview/InventoryOverview";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryFilterProvider } from "@/components/inventory/InventoryFilterContext";
import { InventoryGlobalFilters } from "@/components/inventory/InventoryGlobalFilters";
import { AdvancedKPIDashboard } from "@/components/inventory/advanced/AdvancedKPIDashboard";
import { BufferPenetrationHeatmap } from "@/components/inventory/advanced/BufferPenetrationHeatmap";
import { InteractiveBufferChart } from "@/components/inventory/advanced/InteractiveBufferChart";
import { ExceptionManagement } from "@/components/inventory/advanced/ExceptionManagement";
import { AnalyticsDashboard } from "@/components/inventory/advanced/AnalyticsDashboard";

const Inventory: React.FC = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "overview";
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
        <div className="space-y-6 ">
          <div>
            <h1 className=" text-3xl font-bold tracking-tight">
              {t("inventory.inventoryManagement") || "Inventory Management"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("inventory.managementDescription") ||
                "Plan and manage inventory, buffers & decoupling points."}
            </p>
          </div>

          {/* 🔥 Global Filter */}
          <InventoryGlobalFilters />

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">{t("common.overview")}</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="buffers">{t("inventory.bufferZones")}</TabsTrigger>
              <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
              <TabsTrigger value="classification">{t("inventory.classification")}</TabsTrigger>
              <TabsTrigger value="decoupling">{t("inventory.decouplingPoint")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AdvancedKPIDashboard />
              <BufferPenetrationHeatmap />
              <InteractiveBufferChart />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="buffers">
              <BufferManagementDashboard />
            </TabsContent>

            <TabsContent value="exceptions">
              <ExceptionManagement />
            </TabsContent>

            <TabsContent value="classification">
              <SKUClassifications />
            </TabsContent>

            <TabsContent value="decoupling">
              <DecouplingPointContent />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </InventoryFilterProvider>
  );
};

export default Inventory;
