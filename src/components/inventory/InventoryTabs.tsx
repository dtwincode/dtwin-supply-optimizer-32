
import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { BufferManagementTab } from "./BufferManagementTab";
import { DecouplingTab } from "./DecouplingTab";
import { NetFlowTab } from "./NetFlowTab";
import { ADUTab } from "./ADUTab";
import { AIInsightsTab } from "./AIInsightsTab";
import { ClassificationTab } from "./ClassificationTab";

interface InventoryTabsProps {
  children: ReactNode;
  defaultValue?: string;
}

export const InventoryTabs = ({ children, defaultValue = "inventory" }: InventoryTabsProps) => {
  const { language } = useLanguage();
  
  // Adding console log to check the path
  console.log("Translation paths:", {
    inventoryTitle: "common.inventoryTitle",
    bufferZones: "common.bufferZones",
    decouplingPoint: "common.inventory.decouplingPoint",
    netFlowPosition: "common.netFlowPosition"
  });
  
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="grid grid-cols-7 mb-4">
        <TabsTrigger value="inventory">
          {getTranslation("common.inventoryTitle", language)}
        </TabsTrigger>
        <TabsTrigger value="classification">
          {getTranslation("navigationItems.inventoryClassification", language) || "Classification"}
        </TabsTrigger>
        <TabsTrigger value="buffer">
          {getTranslation("common.bufferZones", language)}
        </TabsTrigger>
        <TabsTrigger value="decoupling">
          {getTranslation("common.inventory.decouplingPoint", language)}
        </TabsTrigger>
        <TabsTrigger value="netflow">
          {getTranslation("common.netFlowPosition", language)}
        </TabsTrigger>
        <TabsTrigger value="adu">
          ADU Analysis
        </TabsTrigger>
        <TabsTrigger value="ai">
          AI Insights
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="inventory">
        {children}
      </TabsContent>
      
      <TabsContent value="classification">
        <ClassificationTab />
      </TabsContent>
      
      <TabsContent value="buffer">
        <BufferManagementTab />
      </TabsContent>
      
      <TabsContent value="decoupling">
        <DecouplingTab />
      </TabsContent>
      
      <TabsContent value="netflow">
        <NetFlowTab />
      </TabsContent>
      
      <TabsContent value="adu">
        <ADUTab />
      </TabsContent>
      
      <TabsContent value="ai">
        <AIInsightsTab />
      </TabsContent>
    </Tabs>
  );
};
