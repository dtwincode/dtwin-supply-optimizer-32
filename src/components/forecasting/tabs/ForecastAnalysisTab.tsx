
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";
import { Card } from "@/components/ui/card";
import { findBestFitModel } from "@/utils/forecasting/modelSelection";
import { useToast } from "@/hooks/use-toast";

interface ForecastAnalysisTabProps {
  filteredData: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

export const ForecastAnalysisTab = ({
  filteredData,
  confidenceIntervals
}: ForecastAnalysisTabProps) => {
  const { toast } = useToast();

  const handleModelChange = (modelId: string) => {
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

  return (
    <div className="space-y-6">
      <ModelSelectionCard
        selectedModel="moving-avg"
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
          <div>
            <h3 className="text-lg font-semibold">Forecast Visualization</h3>
            <p className="text-sm text-muted-foreground">
              Historical data and forecast predictions with confidence intervals
            </p>
          </div>
          <ForecastChart
            data={filteredData}
            confidenceIntervals={confidenceIntervals}
          />
        </div>
      </Card>
    </div>
  );
};
