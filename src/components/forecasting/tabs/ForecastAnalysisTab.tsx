
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

  return (
    <div className="space-y-6">
      {/* Step 1: Model Selection & Configuration */}
      <div>
        <div className="space-y-2">
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
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Step 2: Review Performance</h3>
          <p className="text-sm text-muted-foreground">
            Analyze forecast accuracy and metrics
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-4">
          {/* Left Column - Metrics */}
          <div className="xl:col-span-1">
            <Card className="p-6">
              <h4 className="text-base font-medium mb-4">Forecast Metrics</h4>
              <ForecastMetricsCards 
                metrics={{
                  mape: 12.5,
                  mae: 45.2,
                  rmse: 52.8
                }}
              />
            </Card>
          </div>

          {/* Right Column - Chart */}
          <div className="xl:col-span-3">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-medium">Forecast Visualization</h4>
                  <p className="text-sm text-muted-foreground">
                    Historical data and forecast predictions with confidence intervals
                  </p>
                </div>
                <div className="h-[500px]">
                  <ForecastChart
                    data={filteredData}
                    confidenceIntervals={confidenceIntervals}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Model Versioning - Now under the chart */}
        <div className="mt-6">
          <div className="space-y-2 mb-4">
            <h4 className="text-base font-medium">Model Versions</h4>
            <p className="text-sm text-muted-foreground">
              Track and manage different versions of your model
            </p>
          </div>
          <ModelVersioning modelId={selectedModel} />
        </div>
      </div>

      <Separator />

      {/* Step 3: Scenario Management */}
      <div>
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold">Step 3: Save & Manage Scenarios</h3>
          <p className="text-sm text-muted-foreground">
            Save your current forecast configuration or load existing scenarios
          </p>
        </div>
        <ScenarioManagement
          scenarioName={scenarioName}
          setScenarioName={setScenarioName}
          currentModel={selectedModel}
          currentHorizon={horizon}
          currentParameters={{}}
          forecastData={filteredData}
          onScenarioLoad={handleScenarioLoad}
        />
      </div>
    </div>
  );
};
