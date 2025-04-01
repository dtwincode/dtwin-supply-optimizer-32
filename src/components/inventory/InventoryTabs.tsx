"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryDashboard } from "./InventoryDashboard";

export function InventoryTabs() {
  return (
    <Tabs defaultValue="dashboard" className="w-full">
      <TabsList>
        <TabsTrigger value="dashboard">Inventory Dashboard</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <InventoryDashboard />
      </TabsContent>
    </Tabs>
  );
}
