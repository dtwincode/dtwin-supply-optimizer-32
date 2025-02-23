
import { ModelSelectionCard } from "./ModelSelectionCard";
import { ForecastMetricsCards } from "./ForecastMetricsCards";
import { ForecastingDateRange } from "./ForecastingDateRange";
import { ForecastFilters } from "./ForecastFilters";
import { useState } from "react";
import { ModelParameter } from "@/types/modelParameters";
import { Card } from "@/components/ui/card";

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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <ForecastingDateRange onDateRangeChange={onDateRangeChange} />
          <ForecastFilters onFiltersChange={onFiltersChange} />
        </div>
      </Card>
      
      <ModelSelectionCard
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onParametersChange={handleParametersChange}
      />
      
      <ForecastMetricsCards />
    </div>
  );
};
