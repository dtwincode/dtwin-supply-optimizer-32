import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Target, BarChart3, Settings, PlayCircle } from "lucide-react";
import { ForecastingDashboard } from "@/components/forecasting/ForecastingDashboard";
import { ForecastAccuracy } from "@/components/forecasting/ForecastAccuracy";
import { ModelSelection } from "@/components/forecasting/ModelSelection";
import { ModelEvaluation } from "@/components/forecasting/ModelEvaluation";

const Forecasting = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Demand Forecasting</h1>
          <p className="text-muted-foreground">
            Forecast demand for finished products only (DDMRP-aligned)
          </p>
        </div>

        {/* Info Banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">DDMRP Forecasting Scope</p>
                <p className="text-xs text-muted-foreground">
                  Forecasts are generated for <strong>finished products only</strong>. 
                  Component/raw material requirements are calculated via BOM explosion and managed through DDMRP buffers (demand-driven, not forecast-driven).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="evaluation" className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              Model Evaluation
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Accuracy Analysis
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Model Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <ForecastingDashboard />
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-4">
            <ModelEvaluation />
          </TabsContent>

          <TabsContent value="accuracy" className="space-y-4">
            <ForecastAccuracy />
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <ModelSelection />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
