import React, { useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryFilterProvider } from "@/components/inventory/InventoryFilterContext";
import { InventoryGlobalFilters } from "@/components/inventory/InventoryGlobalFilters";

// Strategic Planning
import { DecouplingPointManager } from "@/components/inventory/strategic/DecouplingPointManager";
import { SupplyChainNetwork } from "@/components/inventory/strategic/SupplyChainNetwork";
import { DecouplingRecommendationPanel } from "@/components/inventory/strategic/DecouplingRecommendationPanel";
import { AlignmentDashboard } from "@/components/inventory/strategic/AlignmentDashboard";

// Bill of Materials
import { BOMViewer } from "@/components/inventory/bom";

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
import { Calculator, TrendingUp, Database, RefreshCw, Package, Truck, Warehouse, DollarSign, AlertTriangle } from "lucide-react";
import { MenuMappingTab } from "@/components/ddmrp-config/MenuMappingTab";
import { MOQDataTab } from "@/components/ddmrp-config/MOQDataTab";
import { StorageRequirementsTab } from "@/components/ddmrp-config/StorageRequirementsTab";
import { SupplierPerformanceTab } from "@/components/ddmrp-config/SupplierPerformanceTab";
import { CostStructureTab } from "@/components/ddmrp-config/CostStructureTab";
import { AnalysisResultsTab } from "@/components/ddmrp-config/AnalysisResultsTab";
import { InventoryConfigTab } from "@/components/ddmrp-config/InventoryConfigTab";
import { DynamicAdjustmentsTab } from "@/components/ddmrp-config/DynamicAdjustmentsTab";
import { SpikeDetectionTab, BufferRecalculationTab } from "@/components/ddmrp-config";

const Inventory: React.FC = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "strategic";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [configTab, setConfigTab] = useState("menu");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
      searchParams.set("tab", value);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const handleCalculateBuffers = async () => {
    setIsCalculating(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-buffer-calculations');
      
      if (error) throw error;
      
      toast({
        title: "Buffer Calculations Complete",
        description: "All DDMRP buffer zones have been recalculated successfully.",
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

  return (
    <InventoryFilterProvider>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("inventory.inventoryManagement") || "DDMRP Inventory Management"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("inventory.managementDescription") ||
                "Strategic buffer planning and operational execution"}
            </p>
          </div>

          <InventoryGlobalFilters />

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="strategic">Strategic Planning</TabsTrigger>
              <TabsTrigger value="operational">Operational View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
              <TabsTrigger value="buffer-profiles">Buffer Profiles</TabsTrigger>
              <TabsTrigger value="breach-alerts">Breach Alerts</TabsTrigger>
              <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="strategic" className="space-y-6">
              <AlignmentDashboard />
              <DecouplingRecommendationPanel />
              <SupplyChainNetwork />
              <DecouplingPointManager />
            </TabsContent>

            <TabsContent value="operational" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <BufferStatusGrid />
                  <ExceptionManagement />
                </div>
                <div>
                  <BreachDetectionTrigger />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <BufferPerformance />
              <SKUClassifications />
            </TabsContent>

            <TabsContent value="buffer-profiles" className="space-y-6">
              <BufferProfileManagement />
            </TabsContent>

            <TabsContent value="breach-alerts" className="space-y-6">
              <BreachAlertsDashboard />
            </TabsContent>

            <TabsContent value="bom" className="space-y-6">
              <BOMViewer />
            </TabsContent>

            <TabsContent value="configuration" className="space-y-6">
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

              <Tabs value={configTab} onValueChange={setConfigTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-10">
                  <TabsTrigger value="menu" className="text-xs">
                    <Package className="h-3 w-3 mr-1" />
                    Menu
                  </TabsTrigger>
                  <TabsTrigger value="moq" className="text-xs">
                    <Truck className="h-3 w-3 mr-1" />
                    MOQ
                  </TabsTrigger>
                  <TabsTrigger value="storage" className="text-xs">
                    <Warehouse className="h-3 w-3 mr-1" />
                    Storage
                  </TabsTrigger>
                  <TabsTrigger value="supplier" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Suppliers
                  </TabsTrigger>
                  <TabsTrigger value="costs" className="text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Costs
                  </TabsTrigger>
                  <TabsTrigger value="daf" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Adjustments
                  </TabsTrigger>
                  <TabsTrigger value="spike" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Spikes
                  </TabsTrigger>
                  <TabsTrigger value="recalc" className="text-xs">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Auto-Recalc
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="text-xs">
                    <Calculator className="h-3 w-3 mr-1" />
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger value="system" className="text-xs">
                    <Database className="h-3 w-3 mr-1" />
                    System
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="menu" className="space-y-4">
                  <MenuMappingTab />
                </TabsContent>

                <TabsContent value="moq" className="space-y-4">
                  <MOQDataTab />
                </TabsContent>

                <TabsContent value="storage" className="space-y-4">
                  <StorageRequirementsTab />
                </TabsContent>

                <TabsContent value="supplier" className="space-y-4">
                  <SupplierPerformanceTab />
                </TabsContent>

                <TabsContent value="costs" className="space-y-4">
                  <CostStructureTab />
                </TabsContent>

                <TabsContent value="daf" className="space-y-4">
                  <DynamicAdjustmentsTab />
                </TabsContent>

                <TabsContent value="spike" className="space-y-4">
                  <SpikeDetectionTab />
                </TabsContent>

                <TabsContent value="recalc" className="space-y-4">
                  <BufferRecalculationTab />
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <AnalysisResultsTab />
                </TabsContent>

                <TabsContent value="system" className="space-y-4">
                  <InventoryConfigTab />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </InventoryFilterProvider>
  );
};

export default Inventory;
