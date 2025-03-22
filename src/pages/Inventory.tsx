
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { useLocation } from "react-router-dom";
import { InventoryTourGuide } from "@/components/inventory/InventoryTourGuide";
import { useLocalStorage } from "@/hooks/use-local-storage";
import DashboardLayout from "@/components/DashboardLayout";
import { DecouplingPointDialog } from "@/components/inventory/DecouplingPointDialog";
import { inventoryData } from "@/data/inventoryData";
import { InventoryItem } from "@/types/inventory";
import { SKUClassification } from "@/components/inventory/types";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryContent } from "@/components/inventory/InventoryContent";
import { LoadingView, ErrorView } from "@/components/inventory/InventoryLoadingError";
import { safeFilter, getDefaultTabFromPath } from "@/utils/inventoryPageUtils";

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
  const [selectedIndustry, setSelectedIndustry] = useLocalStorage('selected-industry', 'retail');
  
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [hasTakenTour, setHasTakenTour] = useLocalStorage('inventory-tour-completed', false);
  
  const defaultTab = getDefaultTabFromPath(location.pathname);

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
    // Reset page when industry changes
    setCurrentPage(1);
  }, [selectedIndustry]);

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

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    toast({
      title: language === 'ar' ? "تم تغيير القطاع" : "Industry Changed",
      description: language === 'ar' 
        ? `تم تحديث عرض المخزون لقطاع ${industry === 'groceries' ? 'البقالة' : industry === 'electronics' ? 'الإلكترونيات' : industry}`
        : `Inventory view updated for ${industry === 'groceries' ? 'Groceries' : industry === 'electronics' ? 'Electronics Sales' : industry} industry`,
    });
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

  const handleDecouplingPointDialogOpen = () => {
    setSelectedLocationId("loc-main-warehouse");
    setDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (hasError) {
    return <ErrorView onRetry={() => window.location.reload()} />;
  }

  return (
    <DashboardLayout>
      <InventoryTourGuide run={isTourRunning} onFinish={handleTourFinish} />
      
      <InventoryHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onDecouplingPointDialogOpen={handleDecouplingPointDialogOpen}
        startTour={startTour}
        selectedIndustry={selectedIndustry}
        onIndustryChange={handleIndustryChange}
      />

      <InventoryContent 
        defaultTab={defaultTab}
        paginatedData={paginatedData}
        filteredData={filteredData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        startIndex={startIndex}
        endIndex={endIndex}
        handleCreatePurchaseOrder={handleCreatePurchaseOrder}
        mockClassifications={mockClassifications}
        handleError={handleError}
      />
      
      <DecouplingPointDialog
        locationId={selectedLocationId}
        onSuccess={handleDecouplingPointSuccess}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </DashboardLayout>
  );
};

export default Inventory;
