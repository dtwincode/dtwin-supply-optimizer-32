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
import { 
  regions, 
  cities, 
  channelTypes, 
  warehouses, 
  savedScenarios,
  forecastData 
} from "@/constants/forecasting";
import { findBestFitModel } from "@/utils/forecasting/modelSelection";
import { ModelConfig } from "@/types/models/commonTypes";
import { SavedScenario } from "@/types/forecasting";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const ForecastingContainer = () => {
  // Set initial dates to show our 2024 data
  const [fromDate, setFromDate] = useState<Date>(new Date('2024-01-01'));
  const [toDate, setToDate] = useState<Date>(new Date('2024-12-26'));
  
  const [selectedModel, setSelectedModel] = useState("moving-avg");
  const [horizon, setHorizon] = useState("12w");
  const [scenarioName, setScenarioName] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<Record<string, any> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("forecast");

  // New product hierarchy state
  const [selectedL1MainProd, setSelectedL1MainProd] = useState<string>("all");
  const [selectedL2ProdLine, setSelectedL2ProdLine] = useState<string>("all");
  const [selectedL3ProdCategory, setSelectedL3ProdCategory] = useState<string>("all");
  const [selectedL4DeviceMake, setSelectedL4DeviceMake] = useState<string>("all");
  const [selectedL5ProdSubCategory, setSelectedL5ProdSubCategory] = useState<string>("all");
  const [selectedL6DeviceModel, setSelectedL6DeviceModel] = useState<string>("all");
  const [selectedL7DeviceColor, setSelectedL7DeviceColor] = useState<string>("all");
  const [selectedL8DeviceStorage, setSelectedL8DeviceStorage] = useState<string>("all");

  const [modelConfigs, setModelConfigs] = useState<ModelConfig[]>(defaultModelConfigs);
  const { toast } = useToast();

  // Generate sample historical data with a more realistic pattern
  const [historicalData] = useState(() => {
    const baseValue = 1000;
    const trendIncrease = 2; // Slight upward trend
    const seasonalFactor = 0.2; // 20% seasonal variation
    
    return Array.from({ length: 180 }, (_, i) => {
      // Add trend
      const trend = baseValue + (i * trendIncrease);
      
      // Add seasonality (quarterly pattern)
      const seasonal = trend * (1 + Math.sin(i * Math.PI / 26) * seasonalFactor);
      
      // Add some random noise (5%)
      const noise = seasonal * (0.95 + Math.random() * 0.1);
      
      return {
        date: new Date(Date.now() - (180 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        actual: Math.round(noise),
        predicted: Math.round(seasonal)
      };
    });
  });

  // Generate forecast table data with realistic patterns
  const [forecastTableData] = useState(() => {
    const lastActual = historicalData[historicalData.length - 1]?.actual || 1200;
    const weeklyGrowth = 0.01; // 1% weekly growth
    
    return Array.from({ length: 12 }, (_, i) => {
      const baseForecast = lastActual * (1 + weeklyGrowth * i);
      const uncertainty = 0.1; // 10% uncertainty range
      
      return {
        week: `Week ${i + 1}`,
        forecast: Math.round(baseForecast),
        lower: Math.round(baseForecast * (1 - uncertainty)),
        upper: Math.round(baseForecast * (1 + uncertainty))
      };
    });
  });

  console.log('Historical Data:', historicalData); // Debug log

  // Create a filter object to pass to useForecastData
  const filters = {
    region: selectedRegion,
    city: selectedCity,
    channel: selectedChannel,
    warehouse: selectedWarehouse,
    productHierarchy: {
      l1MainProd: selectedL1MainProd,
      l2ProdLine: selectedL2ProdLine,
      l3ProdCategory: selectedL3ProdCategory,
      l4DeviceMake: selectedL4DeviceMake,
      l5ProdSubCategory: selectedL5ProdSubCategory,
      l6DeviceModel: selectedL6DeviceModel,
      l7DeviceColor: selectedL7DeviceColor,
      l8DeviceStorage: selectedL8DeviceStorage
    },
    searchQuery,
    dateRange: {
      from: fromDate,
      to: toDate
    }
  };

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
    searchQuery,
    fromDate.toISOString().split('T')[0],
    toDate.toISOString().split('T')[0],
    selectedModel,
    selectedL1MainProd,
    selectedL2ProdLine,
    selectedL3ProdCategory
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

  const handleScenarioLoad = (scenario: SavedScenario) => {
    setSelectedModel(scenario.model);
    setHorizon(scenario.horizon);
    
    try {
      const parsedParams = scenario.parameters ? 
        (Array.isArray(scenario.parameters) ? scenario.parameters : JSON.parse(scenario.parameters as string)) 
        : [];
      
      const typedParams = parsedParams.map((param: any) => {
        if (typeof param === 'object' && param !== null) {
          const modelConfig: ModelConfig = {
            id: param.id || '',
            name: param.name || '',
            parameters: param.parameters || []
          };
          return modelConfig;
        }
        return null;
      }).filter((param): param is ModelConfig => param !== null);
      
      setModelConfigs(typedParams.length > 0 ? typedParams : defaultModelConfigs);
    } catch (error) {
      console.error('Error parsing scenario parameters:', error);
      setModelConfigs(defaultModelConfigs);
    }

    toast({
      title: "Scenario Loaded",
      description: `Loaded scenario: ${scenario.name}`,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-8">
        {/* Step 1: Configuration Header */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Demand Forecasting</h2>
              <p className="text-sm text-muted-foreground">
                Configure, analyze, and manage your demand forecasts
              </p>
            </div>
            <DataUploadDialog 
              module="forecasting"
              onDataUploaded={handleDataUploaded}
            />
          </div>
          <Separator />
        </section>

        {/* Step 2: Model Selection and Controls */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">1</span>
              <h3 className="text-lg font-semibold">Configure Model</h3>
            </div>
            
            <ForecastingHeader
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              handleExport={handleExport}
              findBestModel={findBestModel}
              modelConfigs={modelConfigs}
            />
          </div>
        </Card>

        {/* Step 3: Data Filters */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">2</span>
              <h3 className="text-lg font-semibold">Select Data Range & Filters</h3>
            </div>

            <div className="grid gap-6">
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
                selectedL1MainProd={selectedL1MainProd}
                setSelectedL1MainProd={setSelectedL1MainProd}
                selectedL2ProdLine={selectedL2ProdLine}
                setSelectedL2ProdLine={setSelectedL2ProdLine}
                selectedL3ProdCategory={selectedL3ProdCategory}
                setSelectedL3ProdCategory={setSelectedL3ProdCategory}
                selectedL4DeviceMake={selectedL4DeviceMake}
                setSelectedL4DeviceMake={setSelectedL4DeviceMake}
                selectedL5ProdSubCategory={selectedL5ProdSubCategory}
                setSelectedL5ProdSubCategory={setSelectedL5ProdSubCategory}
                selectedL6DeviceModel={selectedL6DeviceModel}
                setSelectedL6DeviceModel={setSelectedL6DeviceModel}
                selectedL7DeviceColor={selectedL7DeviceColor}
                setSelectedL7DeviceColor={setSelectedL7DeviceColor}
                selectedL8DeviceStorage={selectedL8DeviceStorage}
                setSelectedL8DeviceStorage={setSelectedL8DeviceStorage}
                regions={regions}
                cities={cities}
                channelTypes={channelTypes}
                warehouses={warehouses}
                forecastData={forecastData}
              />
            </div>
          </div>
        </Card>

        {/* Step 4: Key Metrics */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">3</span>
              <h3 className="text-lg font-semibold">Key Performance Metrics</h3>
            </div>
            
            <ForecastMetricsCards metrics={metrics} />
          </div>
        </Card>

        {/* Step 5: Detailed Analysis */}
        <Card className="p-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">4</span>
              <h3 className="text-lg font-semibold">Detailed Analysis</h3>
            </div>

            <div className="space-y-6">
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
            </div>
          </div>
        </Card>

        {/* Step 6: Version Control */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">5</span>
              <h3 className="text-lg font-semibold">Model Version Control</h3>
            </div>

            <div className="max-w-[1200px] mx-auto">
              <ModelVersioning modelId={selectedModel} />
            </div>
          </div>
        </Card>

        {/* Step 7: Scenario Management */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">6</span>
              <h3 className="text-lg font-semibold">Scenario Management</h3>
            </div>

            <ScenarioManagement
              scenarioName={scenarioName}
              setScenarioName={setScenarioName}
              currentModel={selectedModel}
              currentHorizon={horizon}
              currentParameters={modelConfigs}
              forecastData={filteredData}
              onScenarioLoad={handleScenarioLoad}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
