
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupplyPlanningFilters } from "@/components/supply-planning/SupplyPlanningFilters";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIndustry } from "@/contexts/IndustryContext";
import { getTranslation } from "@/translations";
import { Card } from "@/components/ui/card";
import { PharmacySupplyFactors } from "@/components/supply-planning/PharmacySupplyFactors";

const SupplyPlanning = () => {
  const { language } = useLanguage();
  const { selectedIndustry } = useIndustry();
  const [activeTab, setActiveTab] = useState("recommended-orders");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {getTranslation("navigationItems.supplyPlanning", language)}
            </h2>
            <p className="text-muted-foreground mt-1">
              {getTranslation("supplyPlanning.moduleDescription", language)}
            </p>
          </div>
        </div>

        <SupplyPlanningFilters />

        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
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
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {getTranslation("supplyPlanning.recommendedOrders", language)}
              </h3>
              <p className="text-muted-foreground mb-6">
                {getTranslation("supplyPlanning.recommendedOrdersDesc", language)}
              </p>
              {/* Placeholder for recommended orders content */}
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  {getTranslation("supplyPlanning.noRecommendedOrders", language)}
                </p>
              </div>
            </Card>
            
            {selectedIndustry === 'pharmacy' && <PharmacySupplyFactors />}
          </TabsContent>

          <TabsContent value="purchase-orders" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {getTranslation("supplyPlanning.tabs.purchaseOrders", language)}
              </h3>
              <p className="text-muted-foreground mb-6">
                {getTranslation("supplyPlanning.purchaseOrdersDesc", language)}
              </p>
              {/* Placeholder for purchase orders content */}
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  {getTranslation("supplyPlanning.noPurchaseOrders", language)}
                </p>
              </div>
            </Card>
            
            {selectedIndustry === 'pharmacy' && <PharmacySupplyFactors />}
          </TabsContent>

          <TabsContent value="supplier-management" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {getTranslation("supplyPlanning.tabs.supplierManagement", language)}
              </h3>
              <p className="text-muted-foreground mb-6">
                {getTranslation("supplyPlanning.supplierManagementDesc", language)}
              </p>
              {/* Placeholder for supplier management content */}
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  {getTranslation("common.noData", language)}
                </p>
              </div>
            </Card>
            
            {selectedIndustry === 'pharmacy' && <PharmacySupplyFactors />}
          </TabsContent>

          <TabsContent value="lead-time-management" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {getTranslation("supplyPlanning.tabs.leadTimeManagement", language)}
              </h3>
              <p className="text-muted-foreground mb-6">
                {getTranslation("supplyPlanning.leadTimeManagementDesc", language)}
              </p>
              {/* Placeholder for lead time management content */}
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  {getTranslation("common.noData", language)}
                </p>
              </div>
            </Card>
            
            {selectedIndustry === 'pharmacy' && <PharmacySupplyFactors />}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SupplyPlanning;
