import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventorySummaryCards from "@/components/inventory/InventorySummaryCards";
import { InventoryTabs } from "@/components/inventory/InventoryTabs";
import { InventoryTab } from "@/components/inventory/InventoryTab";
import { InventoryChart } from "@/components/inventory/InventoryChart";
import { NetworkDecouplingMap } from "@/components/inventory/NetworkDecouplingMap";
import { InventoryItem, SKUClassification } from "@/types/inventory";
import { SKUClassifications } from "@/components/inventory/classification/SKUClassifications";
import { DecouplingPointDialog } from "@/components/inventory/DecouplingPointDialog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useLocation, useParams } from "react-router-dom";
import { InventoryTourGuide, TourButton } from "@/components/inventory/InventoryTourGuide";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Inventory = () => {
  const { language } = useLanguage();
  const { t } = useI18n();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const location = useLocation();
  const params = useParams();
  
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [hasTakenTour, setHasTakenTour] = useLocalStorage('inventory-tour-completed', false);
  
  const getDefaultTabFromPath = () => {
    if (params.tab) {
      return params.tab;
    }
    
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    
    if (tabParam) {
      return tabParam;
    }
    
    return 'inventory';
  };
  
  const defaultTab = getDefaultTabFromPath();
  console.log("Default tab from path:", defaultTab);

  const fetchInventoryData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("inventory_data")
        .select(`
          inventory_id,
          product_id,
          location_id,
          quantity_on_hand,
          reserved_qty,
          last_updated,
          buffer_profile_id,
          decoupling_point
        `);

      if (error) {
        console.error("Fetch error:", error);
        setHasError(true);
      } else {
        setInventoryData(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

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
    fetchInventoryData();
  }, []);

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
        title: t("common.success"),
        description: t("common.purchaseOrderCreated"),
      });
    } catch (error) {
      console.error("Error creating purchase order:", error);
    }
  };

  const handleDecouplingPointSuccess = () => {
    toast({
      title: t("common.success"),
      description: language === 'ar' ? "تم تحديث إعدادات نقطة الفصل بنجاح" : "Decoupling point configuration updated successfully",
    });
    setDialogOpen(false);
    fetchInventoryData();
  };

  const handleError = (error: Error, info: { componentStack: string }) => {
    console.error("Inventory component error:", error, info);
    setHasError(true);
    toast({
      title: t("common.error"),
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
            <p className="text-muted-foreground">{t("common.inventory.loadingData")}</p>
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

  console.log("Rendering Inventory with tab:", defaultTab);

  return (
    <DashboardLayout>
      <InventoryTourGuide run={isTourRunning} onFinish={handleTourFinish} />
      
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center inventory-header">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                {t("common.inventory.manageAndTrack")}
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
                {t("common.inventory.addDecouplingPoint")}
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
                {t("common.inventory.skuClassifications")}
              </h3>
              <SKUClassifications classifications={[]} />
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
          <ErrorBoundary fallback={<div className="p-6 text-center">{t("common.inventory.errorLoading")}</div>} onError={handleError}>
            <div className="inventory-tabs">
              <InventoryTabs defaultValue={defaultTab}>
                <div className="space-y-4 p-5">
                  <InventoryTab 
                    paginatedData={paginatedData}
                    onCreatePO={handleCreatePurchaseOrder}
                  />
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {t("common.showing")} {filteredData.length > 0 ? startIndex + 1 : 0} {t("common.to")} {Math.min(endIndex, filteredData.length)} {t("common.of")} {filteredData.length} {t("common.items")}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        {t("common.previous")}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredData.length / 10), p + 1))}
                        disabled={currentPage === Math.ceil(filteredData.length / 10) || filteredData.length === 0}
                      >
                        {t("common.next")}
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
