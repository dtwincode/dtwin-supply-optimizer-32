
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
import { ThresholdManagement } from "@/components/inventory/ThresholdManagement";

const Inventory = () => {
  const { language } = useLanguage();
  const { t } = useI18n();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [skuClassifications, setSkuClassifications] = useState<SKUClassification[]>([]);
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
      
      // Fetch inventory data (simplified to handle missing columns)
      const { data, error } = await supabase
        .from("inventory_data")
        .select("*");

      if (error) {
        console.error("Fetch error:", error);
        setHasError(true);
        return;
      }
      
      // Transform to match our expected structure
      const transformedData: InventoryItem[] = data.map(item => ({
        id: item.inventory_id || '',
        inventory_id: item.inventory_id,
        product_id: item.product_id,
        sku: item.product_id, // Using product_id as sku
        quantity_on_hand: item.quantity_on_hand,
        onHand: item.quantity_on_hand,
        reserved_qty: item.reserved_qty,
        location_id: item.location_id,
        location: item.location_id, // Using location_id as location
        last_updated: item.last_updated,
        decoupling_point: item.decoupling_point,
      }));
      
      setInventoryData(transformedData);
    } catch (err) {
      console.error("Unexpected error:", err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSKUClassifications = async () => {
    try {
      // Check if the table exists by performing a simple query
      const tableCheck = await supabase
        .from("sku_classification")
        .select("sku")
        .limit(1);
        
      if (tableCheck.error && tableCheck.error.code === "42P01") {
        // Table doesn't exist - create mock data
        console.log("sku_classification table doesn't exist, using mock data");
        const mockData: SKUClassification[] = [
          { 
            id: "1", 
            sku: "SKU001", 
            classification: {
              leadTimeCategory: "short", 
              variabilityLevel: "low", 
              criticality: "high",
              score: 85
            },
            category: "Electronics"
          },
          { 
            id: "2", 
            sku: "SKU002", 
            classification: {
              leadTimeCategory: "medium", 
              variabilityLevel: "medium", 
              criticality: "medium",
              score: 65
            },
            category: "Furniture"
          },
          { 
            id: "3", 
            sku: "SKU003", 
            classification: {
              leadTimeCategory: "long", 
              variabilityLevel: "high", 
              criticality: "low",
              score: 45
            },
            category: "Apparel"
          }
        ];
        setSkuClassifications(mockData);
        return;
      }
      
      const { data, error } = await supabase
        .from("sku_classification")
        .select("*");
      
      if (error) {
        console.error("Fetch classification error:", error);
        setHasError(true);
      } else {
        // Transform the data to match our expected structure
        const transformedData: SKUClassification[] = data?.map(item => ({
          id: item.id,
          sku: item.sku,
          classification: {
            leadTimeCategory: item.lead_time_category,
            variabilityLevel: item.variability_level,
            criticality: item.criticality,
            score: item.score
          },
          category: item.category
        })) || [];
        
        setSkuClassifications(transformedData);
      }
    } catch (err) {
      console.error("Unexpected classification fetch error:", err);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    fetchSKUClassifications();
  }, []);
  
  useEffect(() => {
    if (!isLoading && !hasError && !hasTakenTour) {
      const tourDelay = setTimeout(() => {
        setIsTourRunning(true);
        console.log("Starting tour");
      }, 1500);
      
      return () => clearTimeout(tourDelay);
    }
  }, [isLoading, hasError, hasTakenTour]);

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

  // Enhance inventory data with classifications
  const enrichedInventory = inventoryData.map(item => {
    // Find matching classification
    const classification = skuClassifications.find(sku => 
      sku.sku === item.sku || sku.sku === item.product_id
    );
    
    if (classification) {
      return {
        ...item,
        classification: classification.classification
      };
    }
    
    return item;
  });
  
  const filteredData = enrichedInventory.filter(
    (item) => safeFilter(item, searchQuery) && 
    (selectedLocationId === "all" || item.location === selectedLocationId)
  );

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
                selectedLocationId={selectedLocationId}
                setSelectedLocationId={setSelectedLocationId}
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

        <ErrorBoundary fallback={<Card className="p-6 text-center"><p>{t("common.inventory.errorLoading")}</p></Card>} onError={handleError}>
          <div className="inventory-summary-cards">
            <InventorySummaryCards />
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<Card className="p-6 text-center"><p>{t("common.inventory.errorLoading")}</p></Card>} onError={handleError}>
          <ThresholdManagement />
        </ErrorBoundary>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ErrorBoundary fallback={<Card className="p-6 text-center"><p>{t("common.inventory.errorLoading")}</p></Card>} onError={handleError}>
            <Card className="p-4 inventory-classifications">
              <h3 className="text-lg font-semibold mb-3">
                {t("common.inventory.skuClassifications")}
              </h3>
              <SKUClassifications classifications={skuClassifications} />
            </Card>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<Card className="p-6 text-center"><p>{t("common.inventory.errorLoading")}</p></Card>} onError={handleError}>
            <div className="inventory-map">
              <NetworkDecouplingMap />
            </div>
          </ErrorBoundary>
        </div>
        
        <ErrorBoundary fallback={<Card className="p-6 text-center"><p>{t("common.inventory.errorLoading")}</p></Card>} onError={handleError}>
          <div className="inventory-chart">
            <InventoryChart data={filteredData} />
          </div>
        </ErrorBoundary>

        <Card>
          <ErrorBoundary fallback={<div className="p-6 text-center"><p>{t("common.inventory.errorLoading")}</p></div>} onError={handleError}>
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
