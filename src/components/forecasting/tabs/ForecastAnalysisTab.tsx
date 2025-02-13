
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";
import { ScenarioManagement } from "@/components/forecasting/ScenarioManagement";
import { Card } from "@/components/ui/card";
import { findBestFitModel } from "@/utils/forecasting/modelSelection";
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

  const handleOptimize = () => {
    const actuals = filteredData.map(d => d.actual).filter(a => a !== null) as number[];
    const modelResults = [{
      modelId: "moving-avg",
      modelName: "Moving Average",
      forecast: filteredData.map(d => d.forecast)
    }];

    const bestModel = findBestFitModel(actuals, modelResults);
    
    toast({
      title: "Best Model Selected",
      description: `${bestModel.modelName} was selected as the optimal model`,
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

  return (
    <div className="space-y-6">
      <ModelSelectionCard
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onOptimize={handleOptimize}
      />
      
      <Card className="p-6">
        <ForecastMetricsCards 
          metrics={{
            mape: 12.5,
            mae: 45.2,
            rmse: 52.8
          }}
        />
      </Card>
      
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Forecast Visualization</h3>
          <p className="text-sm text-muted-foreground">
            Historical data and forecast predictions with confidence intervals
          </p>
          <ForecastChart
            data={filteredData}
            confidenceIntervals={confidenceIntervals}
          />
        </div>
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
  );
};
