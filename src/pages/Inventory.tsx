import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryFilterProvider } from "@/components/inventory/InventoryFilterContext";
import { RightSideFilters } from "@/components/inventory/RightSideFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ExecutionPriorityDashboard } from "@/components/inventory/execution/ExecutionPriorityDashboard";
import { DDMRPPlannerWorkbench } from "@/components/inventory/workbench/DDMRPPlannerWorkbench";
import { CoverageView } from "@/components/inventory/coverage/CoverageView";
import { BufferBreachAlerts } from "@/components/inventory/alerts/BufferBreachAlerts";
import { DecouplingDashboard } from "@/components/inventory/strategic";
import { ExceptionManagement } from "@/components/inventory/advanced/ExceptionManagement";
import { DDMRPPerformanceDashboard } from "@/components/inventory/analytics/DDMRPPerformanceDashboard";
import { ADUAnalysis } from "@/components/inventory/analytics/ADUAnalysis";
import { OnOrderAnalysis } from "@/components/inventory/analytics/OnOrderAnalysis";
import { DailySalesAnalysis } from "@/components/inventory/analytics/DailySalesAnalysis";
import { NetFlowAnalysis } from "@/components/inventory/analytics/NetFlowAnalysis";
import { SKUClassifications } from "@/components/inventory/classification/SKUClassifications";
import { BufferProfileManagement } from "@/components/inventory/buffer-profiles/BufferProfileManagement";
import { BOMViewer } from "@/components/inventory/bom/BOMViewer";
import { BOMExplosionTable } from "@/components/inventory/bom/BOMExplosionTable";
import { ComponentDemandChart } from "@/components/inventory/bom/ComponentDemandChart";
import { BufferDashboard } from "@/components/inventory/unified/BufferDashboard";
import { LayoutDashboard, AlertTriangle, Shield, BarChart3, Settings, Activity, Layers } from "lucide-react";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "coverage";
  const configTab = searchParams.get("tab") || "profiles";
  const [isCalculating, setIsCalculating] = useState(false);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (value: string) => {
    setSearchParams({ view: value });
  };

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

  return (
    <DashboardLayout>
      <InventoryFilterProvider>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("inventory.inventoryManagement") || "DDMRP Inventory Management"}
              </h1>
              <p className="text-muted-foreground mt-1">
                World-class demand-driven material requirements planning
              </p>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <Tabs value={view} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-grid">
              <TabsTrigger value="coverage" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Coverage</span>
              </TabsTrigger>
              <TabsTrigger value="decoupling" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Decoupling</span>
              </TabsTrigger>
              <TabsTrigger value="exceptions" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Exceptions</span>
              </TabsTrigger>
              <TabsTrigger value="execution" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Execution Priority</span>
              </TabsTrigger>
              <TabsTrigger value="buffers" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Buffers</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="configuration" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Configuration</span>
              </TabsTrigger>
            </TabsList>

            {/* Content Area with Right-Side Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content (3/4 width on large screens) */}
              <div className="lg:col-span-3 space-y-6">
                <TabsContent value="coverage" className="mt-0 space-y-6">
                  <CoverageView searchTerm={searchTerm} />
                </TabsContent>

                <TabsContent value="exceptions" className="mt-0 space-y-6">
                  <BufferBreachAlerts />
                  <ExceptionManagement />
                </TabsContent>

                <TabsContent value="execution" className="mt-0 space-y-6">
                  <ExecutionPriorityDashboard />
                </TabsContent>

                <TabsContent value="buffers" className="mt-0 space-y-6">
                  <BufferDashboard mode="status" />
                </TabsContent>

                <TabsContent value="decoupling" className="mt-0">
                  <DecouplingDashboard />
                </TabsContent>

                <TabsContent value="analytics" className="mt-0 space-y-6">
              <Tabs defaultValue="performance" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="adu">ADU Analysis</TabsTrigger>
                  <TabsTrigger value="nfp">Net Flow</TabsTrigger>
                  <TabsTrigger value="onorder">On-Order</TabsTrigger>
                  <TabsTrigger value="sales">Daily Sales</TabsTrigger>
                </TabsList>
                <TabsContent value="performance">
                  <DDMRPPerformanceDashboard />
                </TabsContent>
                <TabsContent value="adu">
                  <ADUAnalysis />
                </TabsContent>
                <TabsContent value="nfp">
                  <NetFlowAnalysis />
                </TabsContent>
                <TabsContent value="onorder">
                  <OnOrderAnalysis />
                </TabsContent>
                <TabsContent value="sales">
                  <DailySalesAnalysis />
                </TabsContent>
              </Tabs>
                  <SKUClassifications />
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
                </TabsContent>

                <TabsContent value="configuration" className="mt-0 space-y-6">
                  <Tabs value={configTab} onValueChange={(value) => setSearchParams({ view: 'configuration', tab: value })}>
                    <TabsList className="grid grid-cols-2 md:grid-cols-5">
                      <TabsTrigger value="profiles">Buffer Profiles</TabsTrigger>
                      <TabsTrigger value="daf">Adjustments</TabsTrigger>
                      <TabsTrigger value="moq">MOQ</TabsTrigger>
                      <TabsTrigger value="supplier">Suppliers</TabsTrigger>
                      <TabsTrigger value="recalc">Auto-Recalc</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profiles"><BufferProfileManagement /></TabsContent>
                    <TabsContent value="daf"><DynamicAdjustmentsTab /></TabsContent>
                    <TabsContent value="moq"><MOQDataTab /></TabsContent>
                    <TabsContent value="supplier"><SupplierPerformanceTab /></TabsContent>
                    <TabsContent value="recalc"><BufferRecalculationTab /></TabsContent>
                  </Tabs>
                </TabsContent>
              </div>

              {/* Right-Side Filters (1/4 width on large screens) */}
              <div className="lg:col-span-1">
                <RightSideFilters 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </div>
            </div>
          </Tabs>
        </div>
      </InventoryFilterProvider>
    </DashboardLayout>
  );
};

export default InventoryNew;
