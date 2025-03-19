
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { PurchaseOrdersTab } from "./PurchaseOrdersTab";
import { SupplierManagementTab } from "./SupplierManagementTab";
import { LeadTimeManagementTab } from "./LeadTimeManagementTab";
import { RecommendedOrdersTab } from "./RecommendedOrdersTab";
import { SupplyPlanningFilters } from "./SupplyPlanningFilters";

export const SupplyPlanningTabs = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("recommended-orders");

  return (
    <div className="space-y-4">
      <SupplyPlanningFilters />
      
      <Tabs defaultValue="recommended-orders" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="recommended-orders">
            {getTranslation("supplyPlanning.tabs.recommendedOrders", language)}
          </TabsTrigger>
          <TabsTrigger value="purchase-orders">
            {getTranslation("supplyPlanning.tabs.purchaseOrders", language)}
          </TabsTrigger>
          <TabsTrigger value="supplier-management">
            {getTranslation("supplyPlanning.tabs.supplierManagement", language)}
          </TabsTrigger>
          <TabsTrigger value="lead-time-management">
            {getTranslation("supplyPlanning.tabs.leadTimeManagement", language)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended-orders" className="space-y-4">
          <RecommendedOrdersTab />
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          <PurchaseOrdersTab />
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
