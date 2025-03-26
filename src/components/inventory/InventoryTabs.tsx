
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { ReactNode } from "react";
import { ClassificationTab } from "./ClassificationTab";
import { BufferManagementTab } from "./BufferManagementTab";
import { DecouplingTab } from "./DecouplingTab";

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
          {getTranslation("inventory.inventoryTitle", language)}
        </TabsTrigger>
        <TabsTrigger value="buffers">
          {getTranslation("inventory.bufferZones", language)}
        </TabsTrigger>
        <TabsTrigger value="decoupling">
          {getTranslation("inventory.decouplingPoint", language)}
        </TabsTrigger>
        <TabsTrigger value="classification">
          {getTranslation("inventory.classification.title", language)}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inventory">
        {children}
      </TabsContent>
      <TabsContent value="buffers">
        <BufferManagementTab />
      </TabsContent>
      <TabsContent value="decoupling">
        <DecouplingTab />
      </TabsContent>
      <TabsContent value="classification">
        <ClassificationTab />
      </TabsContent>
    </Tabs>
  );
}
