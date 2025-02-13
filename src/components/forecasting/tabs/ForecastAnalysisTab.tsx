
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";
import { ScenarioManagement } from "@/components/forecasting/ScenarioManagement";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { SavedScenario } from "@/types/forecasting";

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
    // Handle parameter changes if needed
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Left Column - Model Selection and Metrics */}
      <div className="xl:col-span-1 space-y-6">
        <ModelSelectionCard
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          onParametersChange={handleParametersChange}
        />
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Forecast Metrics</h3>
          <ForecastMetricsCards 
            metrics={{
              mape: 12.5,
              mae: 45.2,
              rmse: 52.8
            }}
          />
        </Card>

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

      {/* Right Column - Chart */}
      <div className="xl:col-span-3">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Forecast Visualization</h3>
                <p className="text-sm text-muted-foreground">
                  Historical data and forecast predictions with confidence intervals
                </p>
              </div>
            </div>
            <div className="h-[600px]"> {/* Fixed height for better visualization */}
              <ForecastChart
                data={filteredData}
                confidenceIntervals={confidenceIntervals}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
