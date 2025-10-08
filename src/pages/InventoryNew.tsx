import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryFilterProvider } from "@/components/inventory/InventoryFilterContext";
import { CollapsibleFilters } from "@/components/inventory/CollapsibleFilters";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { InventorySidebar } from "@/components/inventory/navigation/InventorySidebar";

import { AlignmentDashboard } from "@/components/inventory/strategic/AlignmentDashboard";
import { DecouplingPointManager } from "@/components/inventory/strategic/DecouplingPointManager";
import { ExceptionManagement } from "@/components/inventory/advanced/ExceptionManagement";
import { BufferPerformance } from "@/components/inventory/analytics/BufferPerformance";
import { SKUClassifications } from "@/components/inventory/classification/SKUClassifications";
import { BufferProfileManagement } from "@/components/inventory/buffer-profiles/BufferProfileManagement";
import { BreachAlertsDashboard } from "@/components/inventory/alerts/BreachAlertsDashboard";
import { BOMViewer } from "@/components/inventory/bom/BOMViewer";
import { BOMExplosionTable } from "@/components/inventory/bom/BOMExplosionTable";
import { ComponentDemandChart } from "@/components/inventory/bom/ComponentDemandChart";
import { BufferDashboard } from "@/components/inventory/unified/BufferDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Configuration
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
    const view = searchParams.get("view");
    const configTab = searchParams.get("tab");

    // Configuration tabs
    if (view === "config") {
      switch (configTab) {
        case "profiles":
          return <BufferProfileManagement />;
        case "daf":
          return <DynamicAdjustmentsTab />;
        case "moq":
          return <MOQDataTab />;
        case "supplier":
          return <SupplierPerformanceTab />;
        case "spike":
          return <SpikeDetectionTab />;
        case "analysis":
          return <AnalysisResultsTab />;
        case "menu":
          return <MenuMappingTab />;
        case "storage":
          return <StorageRequirementsTab />;
        case "costs":
          return <CostStructureTab />;
        case "recalc":
          return <BufferRecalculationTab />;
        default:
          return <BufferProfileManagement />;
      }
    }

    // Main views - Task-based organization
    switch (view) {
      case "alerts":
        return (
          <div className="space-y-6">
            <BreachAlertsDashboard />
            <ExceptionManagement />
          </div>
        );
      case "buffers":
        return <BufferDashboard mode="status" />;
      case "decoupling":
        return (
          <div className="space-y-6">
            <DecouplingPointManager />
            <AlignmentDashboard />
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <BufferPerformance />
            <SKUClassifications />
          </div>
        );
      case "advanced":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bill of Materials</CardTitle>
                <CardDescription>Component analysis and demand explosion</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="viewer">
                  <TabsList>
                    <TabsTrigger value="viewer">BOM Viewer</TabsTrigger>
                    <TabsTrigger value="explosion">BOM Explosion</TabsTrigger>
                    <TabsTrigger value="demand">Component Demand</TabsTrigger>
                  </TabsList>
                  <TabsContent value="viewer"><BOMViewer /></TabsContent>
                  <TabsContent value="explosion"><BOMExplosionTable /></TabsContent>
                  <TabsContent value="demand"><ComponentDemandChart /></TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <SKUClassifications />
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <BufferDashboard mode="overview" />
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCalculateBuffers}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Recalculate Buffers
                  </CardTitle>
                  <CardDescription>
                    Update buffer zones based on latest demand patterns
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleRunAnalysis}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Run Demand Analysis
                  </CardTitle>
                  <CardDescription>
                    Analyze demand patterns and variability
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        );
    }
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
