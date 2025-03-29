
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import BufferProfilesTab from "@/components/settings/master_data_new/BufferProfilesTab";
import HistoricalSalesUpload from "@/components/settings/master_data_new/HistoricalSalesUpload";
import InventoryDataUpload from "@/components/settings/master_data_new/InventoryDataUpload";
import LocationUpload from "@/components/settings/master_data_new/LocationUpload";
import ProductPricingUpload from "@/components/settings/master_data_new/ProductPricingUpload";
import ProductUpload from "@/components/settings/master_data_new/ProductUpload";
import VendorUpload from "@/components/settings/master_data_new/VendorUpload";
import { ChevronLeft, ChevronRight, Database, BarChart3, Package, MapPin, Tag, Warehouse, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [dataTab, setDataTab] = useState("products");
  
  const tabs = [
    { id: "products", label: "Products", icon: Package, color: "bg-emerald-400/10 text-emerald-600 dark:text-emerald-400" },
    { id: "vendors", label: "Vendors", icon: Database, color: "bg-violet-400/10 text-violet-600 dark:text-violet-400" },
    { id: "locations", label: "Locations", icon: MapPin, color: "bg-amber-400/10 text-amber-600 dark:text-amber-400" },
    { id: "historical-sales", label: "Historical Sales", icon: BarChart3, color: "bg-blue-400/10 text-blue-600 dark:text-blue-400" },
    { id: "product-pricing", label: "Product Pricing", icon: Tag, color: "bg-pink-400/10 text-pink-600 dark:text-pink-400" },
    { id: "inventory-data", label: "Inventory Data", icon: Warehouse, color: "bg-indigo-400/10 text-indigo-600 dark:text-indigo-400" },
    { id: "buffer-profiles", label: "Buffer Profiles", icon: Shield, color: "bg-cyan-400/10 text-cyan-600 dark:text-cyan-400" },
  ];

  const handleDataTabChange = (value: string) => {
    setDataTab(value);
  };

  return <DashboardLayout>
      <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b">
            <CardTitle className="text-2xl">Data Management</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your uploaded data and configurations
            </CardDescription>
          </CardHeader>
          
          {/* Improved Tab Navigation */}
          <div className="relative pt-6 px-6 border-b">
            <div className="flex items-center mb-4">
              <button 
                className="absolute left-0 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 ml-2"
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === dataTab);
                  const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                  handleDataTabChange(tabs[prevIndex].id);
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="mx-auto overflow-hidden relative w-[calc(100%-80px)]">
                <div className="flex gap-3 justify-center overflow-x-auto no-scrollbar py-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleDataTabChange(tab.id)}
                      className={cn(
                        "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                        dataTab === tab.id
                          ? `${tab.color} shadow-sm`
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 mr-2"
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === dataTab);
                  const nextIndex = (currentIndex + 1) % tabs.length;
                  handleDataTabChange(tabs[nextIndex].id);
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tab Indicator */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${100 / tabs.length}%`,
                  marginLeft: `${(tabs.findIndex(tab => tab.id === dataTab) / tabs.length) * 100}%`
                }}
              />
            </div>
          </div>
          
          {/* Tab Content Container */}
          <CardContent className="p-0">
            <div className="py-6 px-6 min-h-[400px]">
              {/* Tab Content */}
              {dataTab === "products" && <ProductUpload />}
              {dataTab === "vendors" && <VendorUpload />}
              {dataTab === "locations" && <LocationUpload />}
              {dataTab === "historical-sales" && <HistoricalSalesUpload />}
              {dataTab === "product-pricing" && <ProductPricingUpload />}
              {dataTab === "inventory-data" && <InventoryDataUpload />}
              {dataTab === "buffer-profiles" && <BufferProfilesTab />}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>;
}
