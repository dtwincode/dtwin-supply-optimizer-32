
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { BufferProfileDialog } from "./BufferProfileDialog";
import { DecouplingPointDialog } from "./DecouplingPointDialog";
import { ADUVisualization } from "./ADUVisualization";
import { Brain } from "lucide-react";
import { inventoryData } from "@/data/inventoryData";

interface InventoryTabsProps {
  children: React.ReactNode;
}

export const InventoryTabs = ({ children }: InventoryTabsProps) => {
  const { language } = useLanguage();

  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList className="grid w-full grid-cols-7 lg:w-[1000px] p-4">
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
        <TabsTrigger value="ai-leadlink" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI LeadLink
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
          <h3 className="text-lg font-semibold">Average Daily Usage Analysis</h3>
          <div className="grid grid-cols-1 gap-6 mt-4">
            {inventoryData.map((item) => (
              <ADUVisualization key={item.id} item={item} />
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="alerts">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Inventory Alerts</h3>
          {/* Alerts content will go here */}
        </div>
      </TabsContent>

      <TabsContent value="ai-leadlink">
        <div className="p-6">
          <h3 className="text-lg font-semibold">AI LeadLink Analysis</h3>
          <p className="text-muted-foreground mt-2">
            AI-powered analysis for optimizing lead times and replenishment strategies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h4 className="font-medium">Lead Time Analysis</h4>
              {/* Lead time analysis content will go here */}
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Replenishment Optimization</h4>
              {/* Replenishment optimization content will go here */}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
