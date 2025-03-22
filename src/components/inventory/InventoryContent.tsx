
import { Card } from "@/components/ui/card";
import { getTranslation } from "@/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { InventoryTabs } from "@/components/inventory/InventoryTabs";
import { InventoryTab } from "@/components/inventory/InventoryTab";
import { InventoryChart } from "@/components/inventory/InventoryChart";
import { NetworkDecouplingMap } from "@/components/inventory/NetworkDecouplingMap";
import { SKUClassifications } from "@/components/inventory/SKUClassifications";
import InventorySummaryCards from "@/components/inventory/InventorySummaryCards";
import { InventoryItem } from "@/types/inventory";
import { SKUClassification } from "@/components/inventory/types";

interface InventoryContentProps {
  defaultTab: string;
  paginatedData: InventoryItem[];
  filteredData: InventoryItem[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  startIndex: number;
  endIndex: number;
  handleCreatePurchaseOrder: (item: InventoryItem) => void;
  mockClassifications: SKUClassification[];
  handleError: (error: Error, info: { componentStack: string }) => void;
}

export const InventoryContent = ({
  defaultTab,
  paginatedData,
  filteredData,
  currentPage,
  setCurrentPage,
  startIndex,
  endIndex,
  handleCreatePurchaseOrder,
  mockClassifications,
  handleError
}: InventoryContentProps) => {
  const { language } = useLanguage();

  // Handle previous and next page navigation correctly
  const handlePreviousPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(Math.ceil(filteredData.length / 10), currentPage + 1));
  };

  return (
    <div className="space-y-4">
      <ErrorBoundary fallback={<Card className="p-6 text-center">Error loading summary cards</Card>} onError={handleError}>
        <div className="inventory-summary-cards">
          <InventorySummaryCards />
        </div>
      </ErrorBoundary>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ErrorBoundary fallback={<Card className="p-6 text-center">{language === 'ar' ? "خطأ في تحميل تصنيفات وحدات التخزين" : "Error loading SKU classifications"}</Card>} onError={handleError}>
          <Card className="p-4 inventory-classifications">
            <h3 className="text-lg font-semibold mb-3">
              {getTranslation("common.inventory.skuClassifications", language)}
            </h3>
            <SKUClassifications classifications={mockClassifications} />
          </Card>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<Card className="p-6 text-center">{language === 'ar' ? "عرض الخريطة غير متوفر حاليًا" : "Map visualization currently unavailable"}</Card>} onError={handleError}>
          <div className="inventory-map">
            <NetworkDecouplingMap />
          </div>
        </ErrorBoundary>
      </div>
      
      <ErrorBoundary fallback={<Card className="p-6 text-center">{language === 'ar' ? "خطأ في تحميل رسم بياني للمخزون" : "Error loading inventory chart"}</Card>} onError={handleError}>
        <div className="inventory-chart">
          <InventoryChart data={filteredData} />
        </div>
      </ErrorBoundary>

      <Card>
        <ErrorBoundary fallback={<div className="p-6 text-center">{getTranslation("common.inventory.errorLoading", language)}</div>} onError={handleError}>
          <div className="inventory-tabs">
            <InventoryTabs defaultValue={defaultTab}>
              <div className="space-y-4 p-5">
                <InventoryTab 
                  paginatedData={paginatedData}
                  onCreatePO={handleCreatePurchaseOrder}
                />
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {getTranslation("common.showing", language)} {filteredData.length > 0 ? startIndex + 1 : 0} {getTranslation("common.to", language)} {Math.min(endIndex, filteredData.length)} {getTranslation("common.of", language)} {filteredData.length} {getTranslation("common.items", language)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      {getTranslation("common.previous", language)}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={currentPage === Math.ceil(filteredData.length / 10) || filteredData.length === 0}
                    >
                      {getTranslation("common.next", language)}
                    </Button>
                  </div>
                </div>
              </div>
            </InventoryTabs>
          </div>
        </ErrorBoundary>
      </Card>
    </div>
  );
};
