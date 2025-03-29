
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import BufferProfilesTab from "@/components/settings/master_data_new/BufferProfilesTab";
import HistoricalSalesUpload from "@/components/settings/master_data_new/HistoricalSalesUpload";
import InventoryDataUpload from "@/components/settings/master_data_new/InventoryDataUpload";
import LocationUpload from "@/components/settings/master_data_new/LocationUpload";
import ProductPricingUpload from "@/components/settings/master_data_new/ProductPricingUpload";
import ProductUpload from "@/components/settings/master_data_new/ProductUpload";
import VendorUpload from "@/components/settings/master_data_new/VendorUpload";

export default function Settings() {
  const [dataTab, setDataTab] = useState("products");
  
  const handleDataTabChange = (value: string) => {
    setDataTab(value);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Settings</h2>
        </div>
        
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b">
            <CardTitle className="text-2xl">Data Management</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your uploaded data and configurations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={dataTab} onValueChange={handleDataTabChange} className="w-full">
              <div className="border-b">
                <TabsList className="w-full justify-start rounded-none bg-transparent h-auto p-0">
                  <div className="flex overflow-x-auto no-scrollbar py-2 px-4 gap-1">
                    <TabsTrigger 
                      value="products" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400 rounded-full px-4 py-2"
                    >
                      Products
                    </TabsTrigger>
                    <TabsTrigger 
                      value="vendors" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400 rounded-full px-4 py-2"
                    >
                      Vendors
                    </TabsTrigger>
                    <TabsTrigger 
                      value="locations" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400 rounded-full px-4 py-2"
                    >
                      Locations
                    </TabsTrigger>
                    <TabsTrigger 
                      value="historical-sales" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400 rounded-full px-4 py-2"
                    >
                      Historical Sales
                    </TabsTrigger>
                    <TabsTrigger 
                      value="product-pricing" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400 rounded-full px-4 py-2"
                    >
                      Product Pricing
                    </TabsTrigger>
                    <TabsTrigger 
                      value="inventory-data" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400 rounded-full px-4 py-2"
                    >
                      Inventory Data
                    </TabsTrigger>
                    <TabsTrigger 
                      value="buffer-profiles" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-400 rounded-full px-4 py-2"
                    >
                      Buffer Profiles
                    </TabsTrigger>
                  </div>
                </TabsList>
              </div>
              
              <div className="p-0">
                <TabsContent value="products" className="mt-0 border-0">
                  <ProductUpload />
                </TabsContent>
                <TabsContent value="vendors" className="mt-0 border-0">
                  <VendorUpload />
                </TabsContent>
                <TabsContent value="locations" className="mt-0 border-0">
                  <LocationUpload />
                </TabsContent>
                <TabsContent value="historical-sales" className="mt-0 border-0">
                  <HistoricalSalesUpload />
                </TabsContent>
                <TabsContent value="product-pricing" className="mt-0 border-0">
                  <ProductPricingUpload />
                </TabsContent>
                <TabsContent value="inventory-data" className="mt-0 border-0">
                  <InventoryDataUpload />
                </TabsContent>
                <TabsContent value="buffer-profiles" className="mt-0 border-0">
                  <BufferProfilesTab />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
