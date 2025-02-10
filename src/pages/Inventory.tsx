import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventorySummaryCards from "@/components/inventory/InventorySummaryCards";
import { InventoryTableHeader } from "@/components/inventory/InventoryTableHeader";
import { BufferStatusBadge } from "@/components/inventory/BufferStatusBadge";
import { InventoryTabs } from "@/components/inventory/InventoryTabs";
import { inventoryData } from "@/data/inventoryData";
import { calculateBufferStatus } from "@/utils/inventoryUtils";

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
  const [showPurchaseOrderDialog, setShowPurchaseOrderDialog] = useState(false);
  const [showDecouplingDialog, setShowDecouplingDialog] = useState(false);
  const [showBufferAdjustmentDialog, setShowBufferAdjustmentDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleCreatePurchaseOrder = () => {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {getTranslation("common.inventory", language)}
          </h1>
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
            categories={[...new Set(inventoryData.map(item => item.category))]}
            subcategories={[...new Set(inventoryData
              .filter(item => selectedCategory === "all" || item.category === selectedCategory)
              .map(item => item.subcategory))]}
            skus={[...new Set(inventoryData
              .filter(item => 
                (selectedCategory === "all" || item.category === selectedCategory) &&
                (selectedSubcategory === "all" || item.subcategory === selectedSubcategory)
              )
              .map(item => item.sku))]}
            productFamilies={[...new Set(inventoryData.map(item => item.productFamily))]}
            regions={[...new Set(inventoryData.map(item => item.region))]}
            cities={{
              "Central Region": ["Riyadh", "Al-Kharj", "Al-Qassim"],
              "Eastern Region": ["Dammam", "Al-Khobar", "Dhahran"],
              "Western Region": ["Jeddah", "Mecca", "Medina"],
              "Northern Region": ["Tabuk", "Hail", "Al-Jawf"],
              "Southern Region": ["Abha", "Jizan", "Najran"]
            }}
            channelTypes={[...new Set(inventoryData.map(item => item.channel))]}
            locations={[...new Set(inventoryData.map(item => item.location))]}
          />
        </div>

        <InventorySummaryCards />

        <Card>
          <InventoryTabs>
            <TabsContent value="inventory">
              <div className="p-6">
                <Table>
                  <InventoryTableHeader />
                  <TableBody>
                    {paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.currentStock}</TableCell>
                        <TableCell>
                          <BufferStatusBadge status={calculateBufferStatus(item.netFlow)} />
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.productFamily}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowPurchaseOrderDialog(true);
                            }}
                          >
                            {getTranslation("common.createPO", language)}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-between items-center">
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
              </div>
            </TabsContent>
          </InventoryTabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
