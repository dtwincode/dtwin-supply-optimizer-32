
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIndustry } from "@/contexts/IndustryContext";
import { getTranslation } from "@/translations";
import { DashboardTab, TrackingTab, AnalyticsTab, DDOMTab, SustainabilityTab } from "@/components/logistics/tabs";
import { PharmacyLogisticsRequirements } from "@/components/logistics/PharmacyLogisticsRequirements";

const Logistics = () => {
  const { language } = useLanguage();
  const { selectedIndustry } = useIndustry();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-6 pt-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {getTranslation("navigationItems.logistics", language)}
          </h2>
          <p className="text-muted-foreground">
            {getTranslation("common.logistics.description", language) || 
              (language === 'ar' 
                ? "إدارة وتتبع وتحسين سلسلة التوريد الخاصة بك"
                : "Manage, track, and optimize your supply chain")}
          </p>
        </div>

        <Tabs 
          defaultValue={activeTab} 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="dashboard">
              {language === 'ar' ? "لوحة القيادة" : "Dashboard"}
            </TabsTrigger>
            <TabsTrigger value="tracking">
              {language === 'ar' ? "تتبع الشحنات" : "Shipment Tracking"}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              {language === 'ar' ? "تحليلات" : "Analytics"}
            </TabsTrigger>
            <TabsTrigger value="ddom">
              {language === 'ar' ? "DDOM" : "DDOM"}
            </TabsTrigger>
            <TabsTrigger value="sustainability">
              {language === 'ar' ? "الاستدامة" : "Sustainability"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab />
            {selectedIndustry === 'pharmacy' && <PharmacyLogisticsRequirements />}
          </TabsContent>

          <TabsContent value="tracking">
            <TrackingTab />
            {selectedIndustry === 'pharmacy' && <PharmacyLogisticsRequirements />}
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
            {selectedIndustry === 'pharmacy' && <PharmacyLogisticsRequirements />}
          </TabsContent>

          <TabsContent value="ddom">
            <DDOMTab />
            {selectedIndustry === 'pharmacy' && <PharmacyLogisticsRequirements />}
          </TabsContent>

          <TabsContent value="sustainability">
            <SustainabilityTab />
            {selectedIndustry === 'pharmacy' && <PharmacyLogisticsRequirements />}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Logistics;
