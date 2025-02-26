
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { BufferProfileDialog } from "./BufferProfileDialog";
import { DecouplingPointDialog } from "./DecouplingPointDialog";
import { ADUVisualization } from "./ADUVisualization";
import { Brain } from "lucide-react";
import { inventoryData } from "@/data/inventoryData";
import { AILeadLink } from "./AILeadLink";

interface InventoryTabsProps {
  children: React.ReactNode;
}

export const InventoryTabs = ({ children }: InventoryTabsProps) => {
  const { language } = useLanguage();

  return (
    <Tabs defaultValue="inventory" className="w-full">
      <TabsList className="grid w-full grid-cols-7 lg:w-[1000px] p-4">
        <TabsTrigger value="inventory">
          Inventory
        </TabsTrigger>
        <TabsTrigger value="netflow">
          Net Flow
        </TabsTrigger>
        <TabsTrigger value="decoupling">
          Decoupling
        </TabsTrigger>
        <TabsTrigger value="buffers">
          Buffers
        </TabsTrigger>
        <TabsTrigger value="adu">
          ADU
        </TabsTrigger>
        <TabsTrigger value="alerts">
          Alerts
        </TabsTrigger>
        <TabsTrigger value="ai-leadlink" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI Lead
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
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-sm text-muted-foreground mb-4">
              Configure and visualize your supply chain network decoupling points.
            </div>
            <div className="aspect-[16/9] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
              <div className="text-center p-4">
                <h4 className="text-lg font-medium mb-2">Network Board Coming Soon</h4>
                <p className="text-sm text-muted-foreground">
                  Interactive whiteboard for configuring network nodes and decoupling points.
                  Stay tuned for drag-and-drop functionality!
                </p>
              </div>
            </div>
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
          <AILeadLink />
        </div>
      </TabsContent>
    </Tabs>
  );
};
