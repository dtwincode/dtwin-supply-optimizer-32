
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
          <ForecastingDateRange 
            fromDate={new Date()} 
            toDate={new Date()} 
            setFromDate={(date) => onDateRangeChange(date, new Date())}
            setToDate={(date) => onDateRangeChange(new Date(), date)}
          />
          <ForecastFilters 
            searchQuery=""
            setSearchQuery={() => {}}
            selectedRegion="all"
            setSelectedRegion={() => {}}
            selectedCity="all"
            setSelectedCity={() => {}}
            selectedChannel="all"
            setSelectedChannel={() => {}}
            selectedWarehouse="all"
            setSelectedWarehouse={() => {}}
            selectedL1MainProd="all"
            setSelectedL1MainProd={() => {}}
            selectedL2ProdLine="all"
            setSelectedL2ProdLine={() => {}}
            selectedL3ProdCategory="all"
            setSelectedL3ProdCategory={() => {}}
            selectedL4DeviceMake="all"
            setSelectedL4DeviceMake={() => {}}
            selectedL5ProdSubCategory="all"
            setSelectedL5ProdSubCategory={() => {}}
            selectedL6DeviceModel="all"
            setSelectedL6DeviceModel={() => {}}
            selectedL7DeviceColor="all"
            setSelectedL7DeviceColor={() => {}}
            selectedL8DeviceStorage="all"
            setSelectedL8DeviceStorage={() => {}}
            channelTypes={[]}
            warehouses={[]}
            forecastData={[]}
          />
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
