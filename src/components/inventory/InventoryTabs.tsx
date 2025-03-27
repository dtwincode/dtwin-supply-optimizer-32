
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/contexts/I18nContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ClassificationTab } from "./ClassificationTab";
import { DecouplingTab } from "./DecouplingTab";
import { BufferManagementTab } from "./BufferManagementTab";
import { NetFlowTab } from "./NetFlowTab";
import { AIInsightsTab } from "./AIInsightsTab";
import { ADUTab } from "./ADUTab";

interface InventoryTabsProps {
  defaultValue?: string;
  children: React.ReactNode;
}

export const InventoryTabs = ({ defaultValue = "inventory", children }: InventoryTabsProps) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the tab from URL query parameters
  const getTabFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tab') || defaultValue;
  };
  
  // Set the initial tab value from URL
  const initialTab = getTabFromURL();
  
  const handleTabChange = (value: string) => {
    // Update the URL when tab changes
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', value);
    navigate(`/inventory?${searchParams.toString()}`, { replace: true });
    console.log("Tab changed to:", value);
  };
  
  // Effect to sync URL with tab state
  useEffect(() => {
    const currentTab = getTabFromURL();
    if (currentTab !== initialTab) {
      handleTabChange(initialTab);
    }
    console.log("Initial tab from URL:", initialTab);
  }, []);
  
  return (
    <Tabs defaultValue={initialTab} onValueChange={handleTabChange} className="w-full">
      <div className="border-b px-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="inventory">{t("common.inventory.inventoryLevels")}</TabsTrigger>
          <TabsTrigger value="buffer">{t("common.inventory.bufferManagement")}</TabsTrigger>
          <TabsTrigger value="adu">{t("common.inventory.adu")}</TabsTrigger>
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
          <BufferManagementTab />
        </div>
      </TabsContent>
      
      <TabsContent value="adu">
        <div className="p-6">
          <ADUTab />
        </div>
      </TabsContent>
      
      <TabsContent value="classification">
        <div className="p-6">
          <ClassificationTab />
        </div>
      </TabsContent>
      
      <TabsContent value="decoupling">
        <div className="p-6">
          <DecouplingTab />
        </div>
      </TabsContent>
      
      <TabsContent value="netflow">
        <div className="p-6">
          <NetFlowTab />
        </div>
      </TabsContent>
      
      <TabsContent value="ai-insights">
        <div className="p-6">
          <AIInsightsTab />
        </div>
      </TabsContent>
    </Tabs>
  );
};
