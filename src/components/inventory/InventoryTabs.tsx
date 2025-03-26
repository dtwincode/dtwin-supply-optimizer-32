
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { DecouplingPointsList } from "./DecouplingPointsList";
import { DecouplingNetwork } from "./DecouplingNetwork";
import { DecouplingPointRecommendation } from "./DecouplingPointRecommendation";

interface InventoryTabsProps {
  defaultValue?: string;
  children: React.ReactNode;
}

export const InventoryTabs = ({
  defaultValue = "inventory",
  children
}: InventoryTabsProps) => {
  const { language } = useLanguage();
  
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="inventory">
          {getTranslation("common.inventory.inventoryLevels", language)}
        </TabsTrigger>
        <TabsTrigger value="decoupling-list">
          {getTranslation("common.inventory.listView", language)}
        </TabsTrigger>
        <TabsTrigger value="decoupling-network">
          {getTranslation("common.inventory.decouplingNetwork", language)}
        </TabsTrigger>
        <TabsTrigger value="decoupling-recommendation">
          {getTranslation("common.inventory.decouplingPointRecommendation", language)}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inventory">{children}</TabsContent>
      <TabsContent value="decoupling-list">
        <DecouplingPointsList />
      </TabsContent>
      <TabsContent value="decoupling-network">
        <DecouplingNetwork />
      </TabsContent>
      <TabsContent value="decoupling-recommendation">
        <DecouplingPointRecommendation />
      </TabsContent>
    </Tabs>
  );
};
