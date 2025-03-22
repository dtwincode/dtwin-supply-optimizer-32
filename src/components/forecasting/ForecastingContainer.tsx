
import React, { useState } from "react";
import { ForecastingTabs } from "./ForecastingTabs";
import { ForecastingHeader } from "./ForecastingHeader";
import { ForecastChart } from "./ForecastChart";
import { ForecastMetricsCards } from "./ForecastMetricsCards";
import { ForecastTable } from "./ForecastTable";
import { ForecastFilters } from "./ForecastFilters";
import { ModelSelectionCard } from "./ModelSelectionCard";
import { ScenarioManagement } from "./ScenarioManagement";
import { ForecastingDateRange } from "./ForecastingDateRange";
import { ModelVersioning } from "./ModelVersioning";
import { ErrorDistribution } from "./components/ErrorDistribution";
import { ModelRecommendations } from "./components/ModelRecommendations";
import { AnomalyDetection } from "./components/AnomalyDetection";
import { PharmacyForecastingFactors } from "./PharmacyForecastingFactors";
import { useIndustry } from "@/contexts/IndustryContext";
import { useForecastData } from "@/hooks/useForecastData";
import { type ModelParameter } from "@/types/modelParameters";

interface ForecastingContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ForecastingContainer: React.FC<ForecastingContainerProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { selectedIndustry } = useIndustry();
  const [selectedModel, setSelectedModel] = useState("exp-smoothing");
  const [startDate, setStartDate] = useState(new Date('2024-01-01'));
  const [endDate, setEndDate] = useState(new Date('2024-12-31'));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [selectedSku, setSelectedSku] = useState("all");
  const [scenarioName, setScenarioName] = useState("");
  
  const {
    filteredData,
    metrics,
    confidenceIntervals,
    outliers,
    seasonalityPatterns
  } = useForecastData(
    selectedRegion,
    selectedCity,
    selectedChannel,
    selectedWarehouse,
    searchQuery,
    startDate.toISOString(),
    endDate.toISOString(),
    selectedModel,
    selectedCategory,
    selectedSubcategory,
    selectedSku
  );

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleFiltersChange = (filters: any) => {
    // Process filter changes
    console.log("Filters changed:", filters);
  };

  const handleParametersChange = (modelId: string, parameters: ModelParameter[]) => {
    // Process parameter changes
    console.log("Parameters changed for model:", modelId, parameters);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
  };
  
  const mockModels = [
    { id: "arima", name: "ARIMA", accuracy: 92 },
    { id: "prophet", name: "Prophet", accuracy: 88 },
    { id: "exp-smoothing", name: "Exponential Smoothing", accuracy: 85 },
  ];
  
  return (
    <div className="space-y-6">
      <ForecastingHeader 
        onDateRangeChange={handleDateRangeChange}
        onModelChange={handleModelChange}
        onFiltersChange={handleFiltersChange}
        onParametersChange={handleParametersChange}
      />
      <ForecastingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <ForecastMetricsCards metrics={metrics} />
          <ForecastFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
            selectedWarehouse={selectedWarehouse}
            setSelectedWarehouse={setSelectedWarehouse}
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
            channelTypes={['Online', 'Retail', 'Wholesale']}
            warehouses={['Warehouse A', 'Warehouse B', 'Warehouse C']}
            forecastData={filteredData}
          />
          <ForecastChart data={filteredData} confidenceIntervals={confidenceIntervals} />
          <ForecastingDateRange 
            fromDate={startDate} 
            toDate={endDate} 
            setFromDate={setStartDate} 
            setToDate={setEndDate}
          />
          {selectedIndustry === 'pharmacy' && <PharmacyForecastingFactors />}
          <ForecastTable data={filteredData} />
        </div>
      )}

      {activeTab === "models" && (
        <div className="space-y-6">
          <ModelSelectionCard 
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
            onParametersChange={handleParametersChange}
          />
          <ModelVersioning modelId={selectedModel} />
          <ErrorDistribution data={filteredData} />
          <ModelRecommendations models={mockModels} onSelectModel={handleModelSelect} />
          {selectedIndustry === 'pharmacy' && <PharmacyForecastingFactors />}
        </div>
      )}

      {activeTab === "scenarios" && (
        <div className="space-y-6">
          <ScenarioManagement 
            scenarioName={scenarioName}
            setScenarioName={setScenarioName}
            currentModel={selectedModel}
            currentHorizon={12}
            scenarios={[]}
            onCreateScenario={() => {}}
            onDeleteScenario={() => {}}
          />
          <AnomalyDetection data={filteredData} />
          {selectedIndustry === 'pharmacy' && <PharmacyForecastingFactors />}
        </div>
      )}
    </div>
  );
};
