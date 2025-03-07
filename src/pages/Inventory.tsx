import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { Button } from "@/components/ui/button";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventorySummaryCards from "@/components/inventory/InventorySummaryCards";
import { InventoryTabs } from "@/components/inventory/InventoryTabs";
import { InventoryTab } from "@/components/inventory/InventoryTab";
import { InventoryChart } from "@/components/inventory/InventoryChart";
import { NetworkDecouplingMap } from "@/components/inventory/NetworkDecouplingMap";
import { inventoryData } from "@/data/inventoryData";
import { InventoryItem } from "@/types/inventory";
import { SKUClassifications } from "@/components/inventory/SKUClassifications";
import { SKUClassification } from "@/components/inventory/types";
import { DecouplingPointDialog } from "@/components/inventory/DecouplingPointDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const mockClassifications: SKUClassification[] = [
  {
    sku: "SKU001",
    classification: {
      leadTimeCategory: "long",
      variabilityLevel: "medium",
      criticality: "high",
      score: 85
    },
    lastUpdated: "2024-05-15T10:30:00Z"
  },
  {
    sku: "SKU002",
    classification: {
      leadTimeCategory: "medium",
      variabilityLevel: "low",
      criticality: "medium",
      score: 65
    },
    lastUpdated: "2024-05-14T14:20:00Z"
  },
  {
    sku: "SKU003",
    classification: {
      leadTimeCategory: "short",
      variabilityLevel: "high",
      criticality: "low",
      score: 45
    },
    lastUpdated: "2024-05-13T08:45:00Z"
  }
];

const Inventory = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Inventory page loaded successfully");
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Mapbox')) {
        console.log("MapBox error suppressed:", args[0]);
      } else if (args[0] && args[0]._type === 'Error') {
        setHasError(true);
      }
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const handleCreatePurchaseOrder = (item: InventoryItem) => {
    toast({
      title: getTranslation("common.success", language),
      description: getTranslation("common.purchaseOrderCreated", language),
    });
  };

  const handleDecouplingPointSuccess = () => {
    toast({
      title: getTranslation("common.success", language),
      description: language === 'ar' ? "تم تحديث إعدادات نقطة الفصل بنجاح" : "Decoupling point configuration updated successfully",
    });
    setDialogOpen(false);
  };

  const handleError = (error: Error, info: { componentStack: string }) => {
    console.error("Inventory component error:", error, info);
    setHasError(true);
    toast({
      title: getTranslation("common.error", language),
      description: language === 'ar' ? "حدث خطأ أثناء تحميل صفحة المخزون. يرجى المحاولة مرة أخرى لاحقًا." : "An error occurred while loading the inventory page. Please try again later.",
      variant: "destructive",
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
    (currentPage - 1) * 10,
    currentPage * 10
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <p className="text-muted-foreground">{getTranslation("common.inventory.loadingData", language)}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (hasError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-red-600 mb-2">{language === 'ar' ? "حدث خطأ ما" : "Something went wrong"}</h3>
            <p className="text-muted-foreground mb-4">{language === 'ar' ? "واجهنا خطأً أثناء تحميل صفحة المخزون." : "We encountered an error while loading the inventory page."}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="default"
            >
              {language === 'ar' ? "إعادة تحميل الصفحة" : "Reload Page"}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              {getTranslation("common.inventory.manageAndTrack", language)}
            </p>
            <div className="flex gap-2">
              <InventoryFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedLocationId("loc-main-warehouse");
                  setDialogOpen(true);
                }}
              >
                {getTranslation("common.inventory.addDecouplingPoint", language)}
              </Button>
            </div>
          </div>
        </div>

        <ErrorBoundary fallback={<div>{getTranslation("common.inventory.errorLoading", language)}</div>} onError={handleError}>
          <InventorySummaryCards />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div>{language === 'ar' ? "خطأ في تحميل تصنيفات وحدات التخزين" : "Error loading SKU classifications"}</div>} onError={handleError}>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {getTranslation("common.inventory.skuClassifications", language)}
            </h3>
            <SKUClassifications classifications={mockClassifications} />
          </Card>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div>{language === 'ar' ? "عرض الخريطة غير متوفر حاليًا" : "Map visualization currently unavailable"}</div>} onError={handleError}>
          <NetworkDecouplingMap />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div>{language === 'ar' ? "خطأ في تحميل رسم بياني للمخزون" : "Error loading inventory chart"}</div>} onError={handleError}>
          <InventoryChart data={filteredData} />
        </ErrorBoundary>

        <Card>
          <ErrorBoundary fallback={<div className="p-6">{getTranslation("common.inventory.errorLoading", language)}</div>} onError={handleError}>
            <InventoryTabs>
              <TabsContent value="inventory">
                <InventoryTab 
                  paginatedData={paginatedData}
                  onCreatePO={handleCreatePurchaseOrder}
                />
                <div className="mt-4 flex justify-between items-center p-6">
                  <div className="text-sm text-gray-500">
                    {getTranslation("common.showing", language)} {(currentPage - 1) * 10 + 1} {getTranslation("common.to", language)} {Math.min(currentPage * 10, filteredData.length)} {getTranslation("common.of", language)} {filteredData.length} {getTranslation("common.items", language)}
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
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / 10), p + 1))}
                      disabled={currentPage === Math.ceil(filteredData.length / 10)}
                    >
                      {getTranslation("common.next", language)}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </InventoryTabs>
          </ErrorBoundary>
        </Card>
        
        <DecouplingPointDialog
          locationId={selectedLocationId}
          onSuccess={handleDecouplingPointSuccess}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
