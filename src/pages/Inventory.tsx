import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventorySummaryCards from "@/components/inventory/InventorySummaryCards";
import { InventoryTabs } from "@/components/inventory/InventoryTabs";
import { InventoryTab } from "@/components/inventory/InventoryTab";
import { InventoryChart } from "@/components/inventory/InventoryChart";
import { inventoryData } from "@/data/inventoryData";
import { InventoryItem } from "@/types/inventory";

const ITEMS_PER_PAGE = 10;

const Inventory = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedSKU, setSelectedSKU] = useState<string>("all");

  const handleCreatePurchaseOrder = (item: InventoryItem) => {
    toast({
      title: getTranslation("common.success", language),
      description: getTranslation("common.purchaseOrderCreated", language),
    });
  };

  const filteredData = inventoryData.filter(item => {
    if (selectedLocation !== "all" && item.location !== selectedLocation) return false;
    if (selectedFamily !== "all" && item.productFamily !== selectedFamily) return false;
    if (selectedRegion !== "all" && item.region !== selectedRegion) return false;
    if (selectedCity !== "all" && item.city !== selectedCity) return false;
    if (selectedChannel !== "all" && item.channel !== selectedChannel) return false;
    if (selectedWarehouse !== "all" && item.warehouse !== selectedWarehouse) return false;
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (selectedSubcategory !== "all" && item.subcategory !== selectedSubcategory) return false;
    if (selectedSKU !== "all" && item.sku !== selectedSKU) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.sku.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.productFamily.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get unique values for filters
  const categories = [...new Set(inventoryData.map(item => item.category))] as string[];
  const subcategories = [...new Set(inventoryData
    .filter(item => selectedCategory === "all" || item.category === selectedCategory)
    .map(item => item.subcategory))] as string[];
  const skus = [...new Set(inventoryData
    .filter(item => 
      (selectedCategory === "all" || item.category === selectedCategory) &&
      (selectedSubcategory === "all" || item.subcategory === selectedSubcategory)
    )
    .map(item => item.sku))] as string[];
  const productFamilies = [...new Set(inventoryData.map(item => item.productFamily))] as string[];
  const regions = [...new Set(inventoryData.map(item => item.region))] as string[];
  const channelTypes = [...new Set(inventoryData.map(item => item.channel))] as string[];
  const locations = [...new Set(inventoryData.map(item => item.location))] as string[];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'إدارة المخزون والتتبع'
                : 'Manage and track inventory levels'}
            </p>
            <InventoryFilters
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedFamily={selectedFamily}
              setSelectedFamily={setSelectedFamily}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedChannel={selectedChannel}
              setSelectedChannel={setSelectedChannel}
              selectedWarehouse={selectedWarehouse}
              setSelectedWarehouse={setSelectedWarehouse}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              selectedSKU={selectedSKU}
              setSelectedSKU={setSelectedSKU}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categories={categories}
              subcategories={subcategories}
              skus={skus}
              productFamilies={productFamilies}
              regions={regions}
              cities={{
                "Central Region": ["Riyadh", "Al-Kharj", "Al-Qassim"],
                "Eastern Region": ["Dammam", "Al-Khobar", "Dhahran"],
                "Western Region": ["Jeddah", "Mecca", "Medina"],
                "Northern Region": ["Tabuk", "Hail", "Al-Jawf"],
                "Southern Region": ["Abha", "Jizan", "Najran"]
              }}
              channelTypes={channelTypes}
              locations={locations}
            />
          </div>
        </div>

        <InventorySummaryCards />
        
        <InventoryChart data={filteredData} />

        <Card>
          <InventoryTabs>
            <TabsContent value="inventory">
              <InventoryTab 
                paginatedData={paginatedData}
                onCreatePO={handleCreatePurchaseOrder}
              />
              <div className="mt-4 flex justify-between items-center p-6">
                <div className="text-sm text-gray-500">
                  {getTranslation("common.showing", language)} {(currentPage - 1) * ITEMS_PER_PAGE + 1} {getTranslation("common.to", language)} {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} {getTranslation("common.of", language)} {filteredData.length} {getTranslation("common.items", language)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    {getTranslation("common.previous", language)}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / ITEMS_PER_PAGE), p + 1))}
                    disabled={currentPage === Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
                  >
                    {getTranslation("common.next", language)}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </InventoryTabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
