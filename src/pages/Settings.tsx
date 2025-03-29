
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
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your uploaded data</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={dataTab} onValueChange={handleDataTabChange} className="space-y-4">
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="products" className="rounded-md px-3">Products</TabsTrigger>
                <TabsTrigger value="vendors" className="rounded-md px-3">Vendors</TabsTrigger>
                <TabsTrigger value="locations" className="rounded-md px-3">Locations</TabsTrigger>
                <TabsTrigger value="historical-sales" className="rounded-md px-3">Historical Sales</TabsTrigger>
                <TabsTrigger value="product-pricing" className="rounded-md px-3">Product Pricing</TabsTrigger>
                <TabsTrigger value="inventory-data" className="rounded-md px-3">Inventory Data</TabsTrigger>
                <TabsTrigger value="buffer-profiles" className="rounded-md px-3">Buffer Profiles</TabsTrigger>
              </TabsList>
              
              <TabsContent value="products">
                <ProductUpload />
              </TabsContent>
              <TabsContent value="vendors">
                <VendorUpload />
              </TabsContent>
              <TabsContent value="locations">
                <LocationUpload />
              </TabsContent>
              <TabsContent value="historical-sales">
                <HistoricalSalesUpload />
              </TabsContent>
              <TabsContent value="product-pricing">
                <ProductPricingUpload />
              </TabsContent>
              <TabsContent value="inventory-data">
                <InventoryDataUpload />
              </TabsContent>
              <TabsContent value="buffer-profiles">
                <BufferProfilesTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
