
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { PurchaseOrdersTab } from "./PurchaseOrdersTab";
import { SupplierManagementTab } from "./SupplierManagementTab";
import { LeadTimeManagementTab } from "./LeadTimeManagementTab";
import { RecommendedOrdersTab } from "./RecommendedOrdersTab";
import { ReceivingTab } from "./ReceivingTab";
import { ShipmentsTab } from "./ShipmentsTab";
import { TransactionsTab } from "./TransactionsTab";
import { SupplyPlanningFilters } from "./SupplyPlanningFilters";
import { SupplyPlanningMetrics } from "./SupplyPlanningMetrics";

export const SupplyPlanningTabs = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("recommended-orders");

  return (
    <div className="space-y-4">
      <SupplyPlanningFilters />
      
      {activeTab === "lead-time-management" && <SupplyPlanningMetrics />}
      
      <Tabs defaultValue="recommended-orders" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-7 mb-6 bg-background/80 p-1 backdrop-blur-sm">
          <TabsTrigger 
            value="recommended-orders" 
            className="data-[state=active]:bg-dtwin-medium data-[state=active]:text-white"
          >
            {getTranslation("supplyPlanning.tabs.recommendedOrders", language)}
          </TabsTrigger>
          <TabsTrigger 
            value="purchase-orders"
            className="data-[state=active]:bg-dtwin-medium data-[state=active]:text-white"
          >
            {getTranslation("supplyPlanning.tabs.purchaseOrders", language)}
          </TabsTrigger>
          <TabsTrigger 
            value="receiving"
            className="data-[state=active]:bg-dtwin-medium data-[state=active]:text-white"
          >
            {getTranslation("supplyPlanning.tabs.receiving", language) || "Receiving"}
          </TabsTrigger>
          <TabsTrigger 
            value="shipments"
            className="data-[state=active]:bg-dtwin-medium data-[state=active]:text-white"
          >
            {getTranslation("supplyPlanning.tabs.shipments", language) || "Shipments"}
          </TabsTrigger>
          <TabsTrigger 
            value="transactions"
            className="data-[state=active]:bg-dtwin-medium data-[state=active]:text-white"
          >
            {getTranslation("supplyPlanning.tabs.transactions", language) || "Transactions"}
          </TabsTrigger>
          <TabsTrigger 
            value="supplier-management"
            className="data-[state=active]:bg-dtwin-medium data-[state=active]:text-white"
          >
            {getTranslation("supplyPlanning.tabs.supplierManagement", language)}
          </TabsTrigger>
          <TabsTrigger 
            value="lead-time-management"
            className="data-[state=active]:bg-dtwin-medium data-[state=active]:text-white"
          >
            {getTranslation("supplyPlanning.tabs.leadTimeManagement", language)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended-orders" className="space-y-4">
          <RecommendedOrdersTab />
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          <PurchaseOrdersTab />
        </TabsContent>
        
        <TabsContent value="receiving" className="space-y-4">
          <ReceivingTab />
        </TabsContent>
        
        <TabsContent value="shipments" className="space-y-4">
          <ShipmentsTab />
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <TransactionsTab />
        </TabsContent>
        
        <TabsContent value="supplier-management" className="space-y-4">
          <SupplierManagementTab />
        </TabsContent>
        
        <TabsContent value="lead-time-management" className="space-y-4">
          <LeadTimeManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
