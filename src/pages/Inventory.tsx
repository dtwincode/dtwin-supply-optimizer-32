
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

  const handleCreatePurchaseOrder = (item: InventoryItem) => {
    toast({
      title: getTranslation("common.success", language),
      description: getTranslation("common.purchaseOrderCreated", language),
    });
  };

  const filteredData = inventoryData.filter(item => {
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
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'إدارة المخزون والتتبع'
                : 'Manage and track inventory levels'}
            </p>
            <InventoryFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
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
