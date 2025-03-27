
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/contexts/I18nContext";
import { useNavigate, useLocation } from "react-router-dom";

interface InventoryTabsProps {
  defaultValue?: string;
  children: React.ReactNode;
}

export const InventoryTabs = ({ defaultValue = "inventory", children }: InventoryTabsProps) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleTabChange = (value: string) => {
    // Update the URL when tab changes
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', value);
    navigate(`/inventory?${searchParams.toString()}`, { replace: true });
  };
  
  return (
    <Tabs defaultValue={defaultValue} onValueChange={handleTabChange} className="w-full">
      <div className="border-b px-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="inventory">{t("common.inventory.inventoryLevels")}</TabsTrigger>
          <TabsTrigger value="buffer">{t("common.inventory.bufferManagement")}</TabsTrigger>
          <TabsTrigger value="classification">{t("common.inventory.skuClassification")}</TabsTrigger>
          <TabsTrigger value="decoupling">{t("common.inventory.decouplingPoints")}</TabsTrigger>
          <TabsTrigger value="netflow">{t("common.inventory.netFlowPosition")}</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="inventory">
        {children}
      </TabsContent>
      
      <TabsContent value="buffer">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t("common.inventory.bufferManagement")}</h2>
          <p className="text-muted-foreground mb-6">{t("common.inventory.bufferManagementDesc")}</p>
          {/* Buffer Management content will be loaded here */}
        </div>
      </TabsContent>
      
      <TabsContent value="classification">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t("common.inventory.skuClassification")}</h2>
          <p className="text-muted-foreground mb-6">{t("common.inventory.classification.description")}</p>
          {/* Classification content will be loaded here */}
        </div>
      </TabsContent>
      
      <TabsContent value="decoupling">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t("common.inventory.decouplingPoints")}</h2>
          <p className="text-muted-foreground mb-6">{t("common.inventory.configureDecouplingPoints")}</p>
          {/* Decoupling points content will be loaded here */}
        </div>
      </TabsContent>
      
      <TabsContent value="netflow">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t("common.inventory.netFlowPosition")}</h2>
          <p className="text-muted-foreground mb-6">Analyze your inventory flow position and components</p>
          {/* Net Flow content will be loaded here */}
        </div>
      </TabsContent>
      
      <TabsContent value="ai-insights">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">AI-Powered Inventory Insights</h2>
          <p className="text-muted-foreground mb-6">Machine learning predictions and anomaly detection for your supply chain</p>
          {/* AI Insights content will be loaded here */}
        </div>
      </TabsContent>
    </Tabs>
  );
};
