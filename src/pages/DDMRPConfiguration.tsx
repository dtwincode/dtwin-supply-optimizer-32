import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Settings, 
  Package, 
  Warehouse, 
  TrendingUp, 
  DollarSign, 
  Truck,
  Calculator,
  RefreshCw,
  Database
} from "lucide-react";
import { MenuMappingTab } from "@/components/ddmrp-config/MenuMappingTab";
import { MOQDataTab } from "@/components/ddmrp-config/MOQDataTab";
import { StorageRequirementsTab } from "@/components/ddmrp-config/StorageRequirementsTab";
import { SupplierPerformanceTab } from "@/components/ddmrp-config/SupplierPerformanceTab";
import { CostStructureTab } from "@/components/ddmrp-config/CostStructureTab";
import { AnalysisResultsTab } from "@/components/ddmrp-config/AnalysisResultsTab";

export default function DDMRPConfiguration() {
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

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
      // Trigger demand analysis
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
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader 
          title="DDMRP Configuration"
          description="Configure strategic DDMRP parameters and trigger system calculations"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

        <Tabs defaultValue="menu" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
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
            <TabsTrigger value="analysis" className="text-xs">
              <Calculator className="h-3 w-3 mr-1" />
              Analysis
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

          <TabsContent value="analysis" className="space-y-4">
            <AnalysisResultsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
