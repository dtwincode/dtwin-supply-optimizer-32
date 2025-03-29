
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import ProductUpload from "@/components/settings/master_data_new/ProductUpload";
import VendorUpload from "@/components/settings/master_data_new/VendorUpload";
import LocationUpload from "@/components/settings/master_data_new/LocationUpload";
import HistoricalSalesUpload from "@/components/settings/master_data_new/HistoricalSalesUpload";
import ProductPricingUpload from "@/components/settings/master_data_new/ProductPricingUpload";
import InventoryDataUpload from "@/components/settings/master_data_new/InventoryDataUpload";
import BufferProfilesUpload from "@/components/settings/master_data_new/BufferProfilesUpload";

const Settings = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

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
      <div className="space-y-4 max-w-[1200px] mx-auto p-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Management & Configuration</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage master data for your supply chain system
          </p>
        </div>

        <Separator className="my-4" />
        
        <Card className="p-4">
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab}
            onValueChange={handleTabChange} 
            className="space-y-4"
          >
            <TabsList className="flex w-full flex-wrap h-auto p-1 gap-1">
              <TabsTrigger 
                value="products" 
                className="text-xs h-8 px-2 py-1 flex-grow sm:flex-grow-0"
              >
                Products
              </TabsTrigger>
              <TabsTrigger 
                value="vendors" 
                className="text-xs h-8 px-2 py-1 flex-grow sm:flex-grow-0"
              >
                Vendors
              </TabsTrigger>
              <TabsTrigger 
                value="locations" 
                className="text-xs h-8 px-2 py-1 flex-grow sm:flex-grow-0"
              >
                Locations
              </TabsTrigger>
              <TabsTrigger 
                value="historical-sales" 
                className="text-xs h-8 px-2 py-1 flex-grow sm:flex-grow-0"
              >
                Historical Sales
              </TabsTrigger>
              <TabsTrigger 
                value="product-pricing" 
                className="text-xs h-8 px-2 py-1 flex-grow sm:flex-grow-0"
              >
                Product Pricing
              </TabsTrigger>
              <TabsTrigger 
                value="inventory-data" 
                className="text-xs h-8 px-2 py-1 flex-grow sm:flex-grow-0"
              >
                Inventory Data
              </TabsTrigger>
              <TabsTrigger 
                value="buffer-profiles" 
                className="text-xs h-8 px-2 py-1 flex-grow sm:flex-grow-0"
              >
                Buffer Profiles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4 pt-2">
              <ProductUpload />
            </TabsContent>

            <TabsContent value="vendors" className="space-y-4 pt-2">
              <VendorUpload />
            </TabsContent>

            <TabsContent value="locations" className="space-y-4 pt-2">
              <LocationUpload />
            </TabsContent>

            <TabsContent value="historical-sales" className="space-y-4 pt-2">
              <HistoricalSalesUpload />
            </TabsContent>

            <TabsContent value="product-pricing" className="space-y-4 pt-2">
              <ProductPricingUpload />
            </TabsContent>

            <TabsContent value="inventory-data" className="space-y-4 pt-2">
              <InventoryDataUpload />
            </TabsContent>

            <TabsContent value="buffer-profiles" className="space-y-4 pt-2">
              <BufferProfilesUpload />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
