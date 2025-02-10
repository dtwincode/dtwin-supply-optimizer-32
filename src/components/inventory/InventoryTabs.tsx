
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

interface InventoryTabsProps {
  children: React.ReactNode;
}

export const InventoryTabs = ({ children }: InventoryTabsProps) => {
  const { language } = useLanguage();

  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList className="grid w-full grid-cols-6 lg:w-[1000px] p-4">
        <TabsTrigger value="inventory">
          {getTranslation("common.inventory", language)}
        </TabsTrigger>
        <TabsTrigger value="netflow">
          {getTranslation("common.netFlow", language)}
        </TabsTrigger>
        <TabsTrigger value="decoupling">
          {getTranslation("common.decouplingPoint", language)}
        </TabsTrigger>
        <TabsTrigger value="buffers">
          {getTranslation("common.buffers", language)}
        </TabsTrigger>
        <TabsTrigger value="adu">
          {getTranslation("common.adu", language)}
        </TabsTrigger>
        <TabsTrigger value="alerts">
          {getTranslation("common.alerts", language)}
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
