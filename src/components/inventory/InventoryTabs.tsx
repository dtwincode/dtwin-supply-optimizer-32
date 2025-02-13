
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { BufferProfileDialog } from "./BufferProfileDialog";
import { DecouplingPointDialog } from "./DecouplingPointDialog";

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

      <TabsContent value="inventory">
        {children}
      </TabsContent>

      <TabsContent value="decoupling" className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Decoupling Points Management</h3>
            <DecouplingPointDialog locationId="default" onSuccess={() => {
              // Refresh data if needed
            }} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="buffers" className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Buffer Profiles Management</h3>
            <BufferProfileDialog onSuccess={() => {
              // Refresh data if needed
            }} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="netflow">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Net Flow Position</h3>
          {/* Net flow content will go here */}
        </div>
      </TabsContent>

      <TabsContent value="adu">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Average Daily Usage</h3>
          {/* ADU content will go here */}
        </div>
      </TabsContent>

      <TabsContent value="alerts">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Inventory Alerts</h3>
          {/* Alerts content will go here */}
        </div>
      </TabsContent>
    </Tabs>
  );
};
