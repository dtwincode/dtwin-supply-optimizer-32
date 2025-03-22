import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
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
import { Routes, Route, useLocation } from "react-router-dom";
import { InventoryTourGuide, TourButton } from "@/components/inventory/InventoryTourGuide";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

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
  const location = useLocation();
  
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [hasTakenTour, setHasTakenTour] = useLocalStorage('inventory-tour-completed', false);
  
  const getDefaultTabFromPath = () => {
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    const validTabs = ['inventory', 'buffer', 'decoupling', 'netflow', 'adu', 'ai'];
    return validTabs.includes(lastSegment) ? lastSegment : 'inventory';
  };
  
  const defaultTab = getDefaultTabFromPath();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Inventory page loaded successfully");
      
      if (!hasTakenTour) {
        const tourDelay = setTimeout(() => {
          setIsTourRunning(true);
        }, 1500);
        
        return () => clearTimeout(tourDelay);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [hasTakenTour]);

  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Mapbox')) {
        console.log("MapBox error suppressed:", args[0]);
      } else {
        const errorDetected = args.some(arg => 
          (arg && typeof arg === 'object' && arg._type === 'Error') ||
          (arg instanceof Error)
        );
        
        if (errorDetected) {
          setHasError(true);
        }
      }
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const handleCreatePurchaseOrder = (item: InventoryItem) => {
    try {
      toast({
        title: getTranslation("common.success", language),
        description: getTranslation("common.purchaseOrderCreated", language),
      });
    } catch (error) {
      console.error("Error creating purchase order:", error);
    }
  };

  const handleDecouplingPointSuccess = () => {
    toast({
      title: getTranslation("common.success", language),
      description: language === 'ar' ? "تم ت��ديث إعدادات نقطة الفصل بنجاح" : "Decoupling point configuration updated successfully",
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

  const safeFilter = (item: InventoryItem, query: string): boolean => {
    try {
      if (!query) return true;
      
      const queryLower = query.toLowerCase();
      return (
        (item.sku && item.sku.toLowerCase().includes(queryLower)) ||
        (item.name && item.name.toLowerCase().includes(queryLower)) ||
        (item.productFamily && item.productFamily.toLowerCase().includes(queryLower)) ||
        (item.location && item.location.toLowerCase().includes(queryLower))
      );
    } catch (error) {
      console.error("Error filtering inventory item:", error);
      return true; // Show the item if filtering fails
    }
  };

  const filteredData = inventoryData.filter(item => safeFilter(item, searchQuery));

  const startIndex = Math.max(0, (currentPage - 1) * 10);
  const endIndex = Math.min(startIndex + 10, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleTourFinish = () => {
    setIsTourRunning(false);
    setHasTakenTour(true);
    toast({
      title: language === 'ar' ? "اكتملت الجولة!" : "Tour Completed!",
      description: language === 'ar' 
        ? "يمكنك دائمًا إعادة تشغيل الجولة من خلال النقر على زر المساعدة."
        : "You can always restart the tour by clicking the help button.",
    });
  };

  const startTour = () => {
    setIsTourRunning(true);
  };

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
      <InventoryTourGuide run={isTourRunning} onFinish={handleTourFinish} />
      
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center inventory-header">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                {getTranslation("common.inventory.manageAndTrack", language)}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={startTour}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {language === 'ar' ? 'بدء جولة مرشدة' : 'Start guided tour'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-2 inventory-filters">
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
                className="decoupling-point-button"
              >
                {getTranslation("common.inventory.addDecouplingPoint", language)}
              </Button>
              <TourButton onClick={startTour} />
            </div>
          </div>
        </div>

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
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        {getTranslation("common.previous", language)}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / 10), p + 1))}
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
