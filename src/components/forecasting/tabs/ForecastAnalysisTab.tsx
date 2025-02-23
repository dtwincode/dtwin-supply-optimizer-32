
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";
import { ModelVersioning } from "@/components/forecasting/ModelVersioning";
import { ScenarioManagement } from "@/components/forecasting/ScenarioManagement";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { SavedScenario } from "@/types/forecasting";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { ForecastingDateRange } from "@/components/forecasting/ForecastingDateRange";

interface ForecastAnalysisTabProps {
  filteredData: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

export const ForecastAnalysisTab = ({
  filteredData,
  confidenceIntervals
}: ForecastAnalysisTabProps) => {
  const { toast } = useToast();
  const [scenarioName, setScenarioName] = useState("");
  const [selectedModel, setSelectedModel] = useState("moving-avg");
  const [horizon, setHorizon] = useState("12w");
  const [trainingFromDate, setTrainingFromDate] = useState<Date>(new Date('2024-01-01'));
  const [trainingToDate, setTrainingToDate] = useState<Date>(new Date('2024-09-30'));
  const [testingFromDate, setTestingFromDate] = useState<Date>(new Date('2024-10-01'));
  const [testingToDate, setTestingToDate] = useState<Date>(new Date('2024-12-31'));
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const [isProductExpanded, setIsProductExpanded] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    console.log("Selected model:", modelId);
    toast({
      title: "Model Changed",
      description: `Switched to ${modelId} model`,
    });
  };

  const handleScenarioLoad = (scenario: SavedScenario) => {
    setSelectedModel(scenario.model);
    setHorizon(scenario.horizon);
    
    toast({
      title: "Scenario Loaded",
      description: `Loaded scenario: ${scenario.name}`,
    });
  };

  const handleParametersChange = (modelId: string, parameters: any[]) => {
    console.log("Parameters updated for model:", modelId, parameters);
  };

  const handleSectionToggle = (section: 'time' | 'product' | 'location') => {
    switch (section) {
      case 'time':
        setIsTimeExpanded(!isTimeExpanded);
        break;
      case 'product':
        setIsProductExpanded(!isProductExpanded);
        break;
      case 'location':
        setIsLocationExpanded(!isLocationExpanded);
        break;
    }
  };

  return (
    <div className="space-y-8">
      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Time Period Selection */}
        <div className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
            onClick={() => handleSectionToggle('time')}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-primary">Time Period Selection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {isTimeExpanded ? "Click to collapse" : "Click to expand"}
              </span>
              {isTimeExpanded ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary" />
              )}
            </div>
          </Button>

          {isTimeExpanded && (
            <div className="p-6 space-y-6 border-t bg-primary/5">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h4 className="text-base font-medium mb-4">Training Period</h4>
                  <ForecastingDateRange
                    fromDate={trainingFromDate}
                    toDate={trainingToDate}
                    setFromDate={setTrainingFromDate}
                    setToDate={setTrainingToDate}
                  />
                </Card>
                <Card className="p-6">
                  <h4 className="text-base font-medium mb-4">Testing Period</h4>
                  <ForecastingDateRange
                    fromDate={testingFromDate}
                    toDate={testingToDate}
                    setFromDate={setTestingFromDate}
                    setToDate={setTestingToDate}
                  />
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Product Hierarchy */}
        <div className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
            onClick={() => handleSectionToggle('product')}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-primary">Product Hierarchy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {isProductExpanded ? "Click to collapse" : "Click to expand"}
              </span>
              {isProductExpanded ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary" />
              )}
            </div>
          </Button>

          {isProductExpanded && (
            <div className="p-6 border-t bg-primary/5">
              {/* Add Product Hierarchy Filter content here */}
            </div>
          )}
        </div>

        {/* Location Hierarchy */}
        <div className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
            onClick={() => handleSectionToggle('location')}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-primary">Location Hierarchy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {isLocationExpanded ? "Click to collapse" : "Click to expand"}
              </span>
              {isLocationExpanded ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary" />
              )}
            </div>
          </Button>

          {isLocationExpanded && (
            <div className="p-6 border-t bg-primary/5">
              {/* Add Location Hierarchy Filter content here */}
            </div>
          )}
        </div>
      </div>

      {/* Step 1: Model Selection */}
      <div>
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold">Step 1: Select Model</h3>
          <p className="text-sm text-muted-foreground">
            Choose and configure your forecasting model
          </p>
        </div>
        <ModelSelectionCard
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          onParametersChange={handleParametersChange}
        />
      </div>

      <Separator />

      {/* Step 2: Forecast Results & Visualization */}
      <div>
        <div className="space-y-2 mb-6">
          <h3 className="text-lg font-semibold">Step 2: Review Performance</h3>
          <p className="text-sm text-muted-foreground">
            Analyze forecast accuracy and metrics
          </p>
        </div>

        <div className="space-y-6">
          {/* Chart in its own card */}
          <Card className="p-4">
            <div className="space-y-2">
              <div>
                <h4 className="text-base font-medium">Forecast Visualization</h4>
                <p className="text-sm text-muted-foreground">
                  Historical data and forecast predictions with confidence intervals
                </p>
              </div>
              <div className="h-[400px] w-full overflow-hidden">
                <ForecastChart
                  data={filteredData}
                  confidenceIntervals={confidenceIntervals}
                />
              </div>
            </div>
          </Card>

          {/* Metrics Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <h4 className="text-base font-medium mb-4">MAPE</h4>
              <div className="text-2xl font-semibold text-primary">12.5%</div>
              <p className="text-sm text-muted-foreground mt-1">Mean Absolute Percentage Error</p>
            </Card>
            <Card className="p-6">
              <h4 className="text-base font-medium mb-4">MAE</h4>
              <div className="text-2xl font-semibold text-primary">45.2</div>
              <p className="text-sm text-muted-foreground mt-1">Mean Absolute Error</p>
            </Card>
            <Card className="p-6">
              <h4 className="text-base font-medium mb-4">RMSE</h4>
              <div className="text-2xl font-semibold text-primary">52.8</div>
              <p className="text-sm text-muted-foreground mt-1">Root Mean Square Error</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Model Versioning in its own section with proper spacing */}
      <div className="mt-8">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-base font-medium">Model Versions</h4>
              <p className="text-sm text-muted-foreground">
                Track and manage different versions of your model
              </p>
            </div>
            <div className="mt-4">
              <ModelVersioning modelId={selectedModel} />
            </div>
          </div>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Step 3: Scenario Management */}
      <div>
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold">Step 3: Save & Manage Scenarios</h3>
          <p className="text-sm text-muted-foreground">
            Save your current forecast configuration or load existing scenarios
          </p>
        </div>
        <Card className="p-6">
          <ScenarioManagement
            scenarioName={scenarioName}
            setScenarioName={setScenarioName}
            currentModel={selectedModel}
            currentHorizon={horizon}
            currentParameters={{}}
            forecastData={filteredData}
            onScenarioLoad={handleScenarioLoad}
          />
        </Card>
      </div>
    </div>
  );
};
