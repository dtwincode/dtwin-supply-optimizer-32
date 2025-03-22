
import { ModelSelectionCard } from "./ModelSelectionCard";
import { ForecastMetricsCards } from "./ForecastMetricsCards";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ModelParameter } from "@/types/modelParameters";
import { ForecastingHeaderDateRange } from "./header/ForecastingHeaderDateRange";
import { ForecastingHeaderFilters } from "./header/ForecastingHeaderFilters";

interface ForecastingHeaderProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  onModelChange: (modelId: string) => void;
  onFiltersChange: (filters: any) => void;
  onParametersChange: (modelId: string, parameters: ModelParameter[]) => void;
}

export const ForecastingHeader = ({
  onDateRangeChange,
  onModelChange,
  onFiltersChange,
  onParametersChange,
}: ForecastingHeaderProps) => {
  const [selectedModel, setSelectedModel] = useState("exp-smoothing");

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    onModelChange(modelId);
  };

  const handleParametersChange = (modelId: string, parameters: ModelParameter[]) => {
    onParametersChange(modelId, parameters);
  };

  // Sample metrics data for ForecastMetricsCards
  const metrics = {
    mape: 5.2,
    mae: 2.3,
    rmse: 3.1
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <ForecastingHeaderDateRange onDateRangeChange={onDateRangeChange} />
          <ForecastingHeaderFilters onFiltersChange={onFiltersChange} />
        </div>
      </Card>
      
      <ModelSelectionCard
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onParametersChange={handleParametersChange}
      />
      
      <ForecastMetricsCards metrics={metrics} />
    </div>
  );
};
