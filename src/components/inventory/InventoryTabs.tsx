
import { ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BufferManagementTab } from "./BufferManagementTab";
import { DecouplingTab } from "./DecouplingTab";
import { NetFlowTab } from "./NetFlowTab";
import { ADUTab } from "./ADUTab";
import { AIInsightsTab } from "./AIInsightsTab";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface InventoryTabsProps {
  children: ReactNode;
}

export const InventoryTabs = ({ children }: InventoryTabsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Operation completed successfully",
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="buffer">Buffer Management</TabsTrigger>
          <TabsTrigger value="decoupling">Decoupling Points</TabsTrigger>
          <TabsTrigger value="netflow">Net Flow</TabsTrigger>
          <TabsTrigger value="adu">ADU Analysis</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>
        
        {/* Inventory Tab (main inventory table) */}
        {children}
        
        {/* Buffer Management Tab */}
        <TabsContent value="buffer">
          <div className="grid grid-cols-1 gap-4">
            <BufferManagementTab />
          </div>
        </TabsContent>
        
        {/* Decoupling Points Tab */}
        <TabsContent value="decoupling">
          <div className="grid grid-cols-1 gap-4">
            <DecouplingTab />
          </div>
        </TabsContent>
        
        {/* Net Flow Analysis Tab */}
        <TabsContent value="netflow">
          <div className="grid grid-cols-1 gap-4">
            <NetFlowTab />
          </div>
        </TabsContent>
        
        {/* ADU Analysis Tab */}
        <TabsContent value="adu">
          <div className="grid grid-cols-1 gap-4">
            <ADUTab />
          </div>
        </TabsContent>
        
        {/* AI Insights Tab */}
        <TabsContent value="ai">
          <div className="grid grid-cols-1 gap-4">
            <AIInsightsTab />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
