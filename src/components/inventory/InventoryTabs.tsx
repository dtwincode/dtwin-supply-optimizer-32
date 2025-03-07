
import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

interface InventoryTabsProps {
  children: ReactNode;
}

export const InventoryTabs = ({ children }: InventoryTabsProps) => {
  const { language } = useLanguage();
  
  // Adding console log to check the path
  console.log("Translation paths:", {
    inventoryTitle: "common.inventoryTitle",
    bufferZones: "common.bufferZones",
    decouplingPoint: "common.inventory.decouplingPoint",
    netFlowPosition: "common.netFlowPosition"
  });
  
  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList className="grid grid-cols-6 mb-4">
        <TabsTrigger value="inventory">
          {getTranslation("common.inventoryTitle", language)}
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
      {children}
    </Tabs>
  );
};
