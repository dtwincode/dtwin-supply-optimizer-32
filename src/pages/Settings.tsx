
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationHierarchyUpload } from "@/components/settings/location-hierarchy/LocationHierarchyUpload";
import { ProductHierarchyUpload } from "@/components/settings/product-hierarchy/ProductHierarchyUpload";
import { HistoricalSalesUpload } from "@/components/settings/historical-sales/HistoricalSalesUpload";
import { LeadTimeUpload } from "@/components/settings/lead-time/LeadTimeUpload";
import { ReplenishmentUpload } from "@/components/settings/replenishment/ReplenishmentUpload";
import { IntegratedDataPreview } from "@/components/settings/integrated-data/IntegratedDataPreview";
import { IndustrySettings } from "@/components/settings/IndustrySettings";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("integrated-data");

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Add a handler for tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading data management...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto p-4 sm:p-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Management & Configuration</h2>
          <p className="text-muted-foreground mt-2">
            Configure system settings and manage data hierarchies across your organization
          </p>
        </div>

        <Separator className="my-6" />
        
        <Card className="p-4 sm:p-6">
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab}
            onValueChange={handleTabChange} 
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
              <TabsTrigger value="industry">Industry</TabsTrigger>
              <TabsTrigger value="location">Location Hierarchy</TabsTrigger>
              <TabsTrigger value="product">Product Hierarchy</TabsTrigger>
              <TabsTrigger value="historical-sales">Historical Sales</TabsTrigger>
              <TabsTrigger value="integrated-data">Integrated Data</TabsTrigger>
              <TabsTrigger value="lead-time">Lead Time</TabsTrigger>
              <TabsTrigger value="replenishment-time">Replenishment</TabsTrigger>
            </TabsList>

            <TabsContent value="industry" className="space-y-4">
              <IndustrySettings />
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <LocationHierarchyUpload />
            </TabsContent>

            <TabsContent value="product" className="space-y-4">
              <ProductHierarchyUpload />
            </TabsContent>

            <TabsContent value="historical-sales" className="space-y-4">
              <HistoricalSalesUpload />
            </TabsContent>

            <TabsContent value="integrated-data" className="space-y-4">
              <IntegratedDataPreview />
            </TabsContent>

            <TabsContent value="lead-time" className="space-y-4">
              <LeadTimeUpload />
            </TabsContent>

            <TabsContent value="replenishment-time" className="space-y-4">
              <ReplenishmentUpload />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
