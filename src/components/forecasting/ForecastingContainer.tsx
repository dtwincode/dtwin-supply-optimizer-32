
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ForecastMetricsCards } from "./ForecastMetricsCards";
import { ForecastingHeader } from "./ForecastingHeader";
import { ForecastingDateRange } from "./ForecastingDateRange";
import { ForecastingTabs } from "./ForecastingTabs";
import { ForecastFilters } from "./ForecastFilters";
import { ScenarioManagement } from "./ScenarioManagement";
import { ModelVersioning } from "./ModelVersioning";
import { DataUploadDialog } from "../settings/DataUploadDialog";
import { useForecastData } from "@/hooks/useForecastData";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useMarketEvents } from "@/hooks/useMarketEvents";
import { usePriceAnalysis } from "@/hooks/usePriceAnalysis";
import { defaultModelConfigs } from "@/types/modelParameters";
import { findBestFitModel } from "@/utils/forecasting";
import { 
  savedScenarios, 
  regions, 
  cities, 
  channelTypes, 
  warehouses, 
  forecastData 
} from "@/constants/forecasting";

export const ForecastingContainer = () => {
  // Set initial dates to show our 2024 data
  const [fromDate, setFromDate] = useState<Date>(new Date('2024-01-01'));
  const [toDate, setToDate] = useState<Date>(new Date('2024-12-26'));
  
  const [selectedModel, setSelectedModel] = useState("moving-avg");
  const [horizon, setHorizon] = useState("12w");
  const [scenarioName, setScenarioName] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("forecast");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedSku, setSelectedSku] = useState<string>("all");
  const [modelConfigs, setModelConfigs] = useState(defaultModelConfigs);
  const { toast } = useToast();

  const [historicalData] = useState(() => {
    return Array.from({ length: 180 }, (_, i) => ({
      date: new Date(Date.now() - (180 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      actual: Math.round(1000 + Math.random() * 500),
      predicted: Math.round(900 + Math.random() * 600)
    }));
  });

  const [forecastTableData] = useState(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      week: `Week ${i + 1}`,
      forecast: Math.round(1200 + Math.random() * 300),
      lower: Math.round(1000 + Math.random() * 200),
      upper: Math.round(1400 + Math.random() * 200)
    }));
  });

  const { 
    filteredData, 
    metrics, 
    confidenceIntervals, 
    decomposition, 
    validationResults, 
    crossValidationResults 
  } = useForecastData(
    selectedRegion,
    selectedCity,
    selectedChannel,
    selectedWarehouse,
    selectedCategory,
    selectedSubcategory,
    selectedSku,
    searchQuery,
    fromDate,
    toDate
  );

  const {
    weatherLocation,
    setWeatherLocation,
    weatherData,
    fetchWeatherForecast
  } = useWeatherData();

  const {
    marketEvents,
    setMarketEvents,
    newEvent,
    setNewEvent
  } = useMarketEvents();

  const {
    priceAnalysis,
    historicalPriceData,
    addHistoricalPricePoint,
    calculatePriceAnalysis
  } = usePriceAnalysis();

  const handleExport = () => {
    const csvContent = [
      ["Week", "Actual", "Forecast", "Variance", "Region", "City", "Channel", "Category", "Subcategory", "SKU"],
      ...filteredData.map(d => [
        d.week,
        d.actual,
        d.forecast,
        d.variance,
        d.region,
        d.city,
        d.channel,
        d.category,
        d.subcategory,
        d.sku
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forecast_data.csv";
    a.click();
  };

  const findBestModel = () => {
    const actuals = filteredData.map(d => d.actual).filter(a => a !== null) as number[];
    
    const modelResults = modelConfigs.map(model => ({
      modelId: model.id,
      modelName: model.name,
      forecast: filteredData.map(d => d.forecast)
    }));

    const bestModel = findBestFitModel(actuals, modelResults);
    
    setSelectedModel(bestModel.modelId);
    
    toast({
      title: "Best Fit Model Selected",
      description: `${bestModel.modelName} was selected as the best fitting model with MAPE: ${bestModel.metrics.mape.toFixed(2)}%`,
    });
  };

  const handleDataUploaded = () => {
    toast({
      title: "Success",
      description: "Forecast data has been uploaded successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <ForecastingHeader
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            handleExport={handleExport}
            findBestModel={findBestModel}
            modelConfigs={modelConfigs}
          />
          <DataUploadDialog 
            module="forecasting"
            onDataUploaded={handleDataUploaded}
          />
        </div>

        <ModelVersioning modelId={selectedModel} />

        <ForecastingDateRange
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />

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
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          selectedSku={selectedSku}
          setSelectedSku={setSelectedSku}
          regions={regions}
          cities={cities}
          channelTypes={channelTypes}
          warehouses={warehouses}
          forecastData={forecastData}
        />
      </div>

      <ForecastMetricsCards metrics={metrics} />

      <ForecastingTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historicalData={historicalData}
        filteredData={filteredData}
        confidenceIntervals={confidenceIntervals}
        decomposition={decomposition}
        validationResults={validationResults}
        crossValidationResults={crossValidationResults}
        weatherLocation={weatherLocation}
        setWeatherLocation={setWeatherLocation}
        weatherData={weatherData}
        fetchWeatherForecast={fetchWeatherForecast}
        marketEvents={marketEvents}
        setMarketEvents={setMarketEvents}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        priceAnalysis={priceAnalysis}
        historicalPriceData={historicalPriceData}
        addHistoricalPricePoint={addHistoricalPricePoint}
        calculatePriceAnalysis={calculatePriceAnalysis}
        forecastTableData={forecastTableData}
      />

      <ScenarioManagement
        scenarioName={scenarioName}
        setScenarioName={setScenarioName}
        savedScenarios={savedScenarios}
        selectedScenario={selectedScenario}
        setSelectedScenario={setSelectedScenario}
      />
    </div>
  );
};
