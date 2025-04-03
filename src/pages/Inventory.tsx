import React, { useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BufferManagementContent } from "@/components/inventory/buffer/BufferManagementContent";
import { SKUClassifications } from "@/components/inventory/classification/SKUClassifications";
import { DecouplingPointContent } from "@/components/inventory/decoupling/DecouplingPointContent";
import { InventoryOverview } from "@/components/inventory/overview/InventoryOverview";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryFilterProvider } from "@/contexts/InventoryFilterContext";

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
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("inventory.inventoryManagement") || "Inventory Management"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("inventory.management.description") ||
                "Plan and manage inventory, buffers & decoupling points."}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">{t("common.overview")}</TabsTrigger>
              <TabsTrigger value="buffers">{t("inventory.bufferZones")}</TabsTrigger>
              <TabsTrigger value="classification">{t("inventory.classification")}</TabsTrigger>
              <TabsTrigger value="decoupling">{t("inventory.decouplingPoint")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <InventoryOverview />
            </TabsContent>

            <TabsContent value="buffers">
              <BufferManagementContent />
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
