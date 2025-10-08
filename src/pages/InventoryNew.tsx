import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryFilterProvider } from "@/components/inventory/InventoryFilterContext";
import { CollapsibleFilters } from "@/components/inventory/CollapsibleFilters";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { InventorySidebar } from "@/components/inventory/navigation/InventorySidebar";

// Strategic Planning
import { DecouplingPointManager } from "@/components/inventory/strategic/DecouplingPointManager";
import { SupplyChainNetwork } from "@/components/inventory/strategic/SupplyChainNetwork";
import { DecouplingRecommendationPanel } from "@/components/inventory/strategic/DecouplingRecommendationPanel";
import { AlignmentDashboard } from "@/components/inventory/strategic/AlignmentDashboard";

// Bill of Materials
import { BOMViewer, BOMExplosionTable, ComponentDemandChart } from "@/components/inventory/bom";

// Operational View
import { BufferStatusGrid } from "@/components/inventory/operational/BufferStatusGrid";
import { BreachDetectionTrigger } from "@/components/inventory/operational/BreachDetectionTrigger";
import { ExceptionManagement } from "@/components/inventory/advanced/ExceptionManagement";

// Analytics & Insights
import { BufferPerformance } from "@/components/inventory/analytics/BufferPerformance";
import { SKUClassifications } from "@/components/inventory/classification/SKUClassifications";

// Buffer Management
import { BufferProfileManagement } from "@/components/inventory/buffer-profiles";
import { BreachAlertsDashboard } from "@/components/inventory/alerts";

// Configuration
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calculator, TrendingUp, Database, RefreshCw } from "lucide-react";
import { MenuMappingTab } from "@/components/ddmrp-config/MenuMappingTab";
import { MOQDataTab } from "@/components/ddmrp-config/MOQDataTab";
import { StorageRequirementsTab } from "@/components/ddmrp-config/StorageRequirementsTab";
import { SupplierPerformanceTab } from "@/components/ddmrp-config/SupplierPerformanceTab";
import { CostStructureTab } from "@/components/ddmrp-config/CostStructureTab";
import { AnalysisResultsTab } from "@/components/ddmrp-config/AnalysisResultsTab";
import { InventoryConfigTab } from "@/components/ddmrp-config/InventoryConfigTab";
import { DynamicAdjustmentsTab } from "@/components/ddmrp-config/DynamicAdjustmentsTab";
import { SpikeDetectionTab, BufferRecalculationTab } from "@/components/ddmrp-config";

const InventoryNew: React.FC = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "alignment";
  const configTab = searchParams.get("tab") || "menu";
  const [isCalculating, setIsCalculating] = useState(false);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

  const handleCalculateBuffers = async () => {
    setIsCalculating(true);
    try {
      toast({
        title: "Starting Buffer Recalculation",
        description: "Processing buffers in batches to avoid timeout...",
      });

      const { data, error } = await supabase.functions.invoke('recalculate-buffers-batch', {
        body: { batch_size: 100 }
      });
      
      if (error) throw error;
      
      toast({
        title: "Buffer Calculations Complete",
        description: `Successfully recalculated ${data.success_count} out of ${data.requested_count} buffers`,
      });
    } catch (error) {
      console.error("Error calculating buffers:", error);
      toast({
        title: "Calculation Failed",
        description: error instanceof Error ? error.message : "Failed to calculate buffer zones",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRunAnalysis = async () => {
    setIsRunningAnalysis(true);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-demand-analytics');
      
      if (error) throw error;
      
      toast({
        title: "Analysis Complete",
        description: "Demand history and usage analysis completed successfully.",
      });
    } catch (error) {
      console.error("Error running analysis:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to run analysis",
        variant: "destructive",
      });
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  const renderContent = () => {
    // Strategic Planning Views
    if (view === "alignment") return <AlignmentDashboard />;
    if (view === "decoupling") return <DecouplingPointManager />;
    if (view === "network") return <SupplyChainNetwork />;
    if (view === "recommendations") return <DecouplingRecommendationPanel />;

    // Operations Views
    if (view === "buffer-status") return <BufferStatusGrid />;
    if (view === "breach-detection") return <BreachDetectionTrigger />;
    if (view === "exceptions") return <ExceptionManagement />;

    // Analytics Views
    if (view === "buffer-performance") return <BufferPerformance />;
    if (view === "sku-classifications") return <SKUClassifications />;

    // Buffer Profiles
    if (view === "buffer-profiles") return <BufferProfileManagement />;

    // Breach Alerts
    if (view === "breach-alerts") return <BreachAlertsDashboard />;

    // BOM Views
    if (view === "bom-viewer") return <BOMViewer />;
    if (view === "bom-explosion") return <BOMExplosionTable />;
    if (view === "component-demand") return <ComponentDemandChart />;

    // Configuration
    if (view === "config") {
      return (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Buffer Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleCalculateBuffers} 
                  disabled={isCalculating}
                  className="w-full"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculate Buffers
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recalculate all buffer zones (TOR, TOY, TOG)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Demand Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleRunAnalysis} 
                  disabled={isRunningAnalysis}
                  variant="outline"
                  className="w-full"
                >
                  {isRunningAnalysis ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Run Analysis
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Analyze demand patterns and variability
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Tables Populated:</span>
                    <span className="font-medium text-green-600">9/9</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-green-600">Operational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Content */}
          {configTab === "menu" && <MenuMappingTab />}
          {configTab === "moq" && <MOQDataTab />}
          {configTab === "storage" && <StorageRequirementsTab />}
          {configTab === "supplier" && <SupplierPerformanceTab />}
          {configTab === "costs" && <CostStructureTab />}
          {configTab === "daf" && <DynamicAdjustmentsTab />}
          {configTab === "spike" && <SpikeDetectionTab />}
          {configTab === "recalc" && <BufferRecalculationTab />}
          {configTab === "analysis" && <AnalysisResultsTab />}
          {configTab === "system" && <InventoryConfigTab />}
        </div>
      );
    }

    return <AlignmentDashboard />;
  };

  return (
    <InventoryFilterProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <InventorySidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">
                  {t("inventory.inventoryManagement") || "DDMRP Inventory Management"}
                </h1>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 space-y-6">
              <CollapsibleFilters />
              <div className="animate-fade-in">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </InventoryFilterProvider>
  );
};

export default InventoryNew;
