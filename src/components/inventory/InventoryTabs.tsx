import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { ReactNode } from "react";
import { ClassificationTab } from "./ClassificationTab";

interface InventoryTabsProps {
  defaultValue?: string;
  children?: ReactNode;
}

export function InventoryTabs({ defaultValue = "inventory", children }: InventoryTabsProps) {
  const { language } = useLanguage();

  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="inventory">
          {getTranslation("common.inventory.inventoryTitle", language)}
        </TabsTrigger>
        <TabsTrigger value="buffers">
          {getTranslation("common.inventory.bufferZones", language)}
        </TabsTrigger>
        <TabsTrigger value="decoupling">
          {getTranslation("common.inventory.decouplingPoint", language)}
        </TabsTrigger>
        <TabsTrigger value="classification">
          {getTranslation("navigationItems.inventoryClassification", language)}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inventory">
        {children}
      </TabsContent>
      <TabsContent value="buffers">
        <div className="space-y-4">
          {/* Buffer Management Component will go here */}
          <p className="text-muted-foreground p-4">
            {language === "ar" ? "إدارة مناطق المخزون" : "Buffer Management Component"}
          </p>
        </div>
      </TabsContent>
      <TabsContent value="decoupling">
        <div className="space-y-4">
          {/* Decoupling Point Management Component will go here */}
          <p className="text-muted-foreground p-4">
            {language === "ar" ? "إدارة نقاط الفصل" : "Decoupling Point Management Component"}
          </p>
        </div>
      </TabsContent>
      <TabsContent value="classification">
        <ClassificationTab />
      </TabsContent>
    </Tabs>
  );
}
