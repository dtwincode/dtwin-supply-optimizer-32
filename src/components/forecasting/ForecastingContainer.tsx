
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
import { ForecastData } from "./table/types";
import { SavedModelConfig } from "@/types/forecasting";

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

  // Convert ForecastDataPoint[] to ForecastData[]
  const tableData: ForecastData[] = filteredData.map(item => ({
    id: item.id,
    week: item.week,
    forecast: item.forecast,
    lower: item.forecast * 0.9, // Create lower bound based on forecast
    upper: item.forecast * 1.1, // Create upper bound based on forecast
    sku: item.sku,
    category: item.category,
    subcategory: item.subcategory
  }));
  
  // Create properly typed mock data for model recommendations
  const mockModels: SavedModelConfig[] = [
    { 
      id: "arima", 
      model_id: "arima",
      parameters: [{ name: "p", value: 1, description: "Auto-regressive term" }],
      created_at: "2024-01-01T00:00:00Z",
      performance_metrics: { accuracy: 92, trend: "improving", trained_at: "2024-01-01T00:00:00Z" }
    },
    { 
      id: "prophet", 
      model_id: "prophet",
      parameters: [{ name: "changepoint_prior_scale", value: 0.05, description: "Flexibility of the trend" }],
      created_at: "2024-01-01T00:00:00Z",
      performance_metrics: { accuracy: 88, trend: "stable", trained_at: "2024-01-01T00:00:00Z" }
    },
    { 
      id: "exp-smoothing", 
      model_id: "exp-smoothing",
      parameters: [{ name: "alpha", value: 0.3, description: "Smoothing factor" }],
      created_at: "2024-01-01T00:00:00Z",
      performance_metrics: { accuracy: 85, trend: "stable", trained_at: "2024-01-01T00:00:00Z" }
    }
  ];
  
  return (
    <div className="space-y-6">
      <ForecastingHeader 
        onDateRangeChange={handleDateRangeChange}
        onModelChange={handleModelChange}
        onFiltersChange={handleFiltersChange}
        onParametersChange={handleParametersChange}
      />
      
      {/* We'll need to modify the ForecastingTabs component to accept activeTab and setActiveTab props */}
      <div className="mb-4">
        <ForecastingTabs />
      </div>

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
          <ForecastTable data={tableData} />
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
