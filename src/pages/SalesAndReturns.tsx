
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { SalesPlanning } from "@/components/sales/SalesPlanning";
import { ReturnsManagement } from "@/components/sales/ReturnsManagement";

const SalesAndReturnsPage = () => {
  const [activeTab, setActiveTab] = useState<"sales" | "returns">("sales");
  const { language } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {getTranslation('sales.salesAndReturns', language) || "Sales & Returns"}
              </h1>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'تخطيط وإدارة المبيعات والمرتجعات'
                  : 'Plan and manage sales activities and returns'}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "sales" | "returns")} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
            <TabsTrigger value="sales">
              {getTranslation('sales.salesPlanning', language) || "Sales Planning"}
            </TabsTrigger>
            <TabsTrigger value="returns">
              {getTranslation('sales.returnsManagement', language) || "Returns Management"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="mt-4">
            <SalesPlanning />
          </TabsContent>
          
          <TabsContent value="returns" className="mt-4">
            <ReturnsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SalesAndReturnsPage;
