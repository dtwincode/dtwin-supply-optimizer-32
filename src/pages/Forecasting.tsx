import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Wand2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateMetrics,
  calculateConfidenceIntervals,
  decomposeSeasonality,
  validateForecast,
  performCrossValidation,
  findBestFitModel,
} from "@/utils/forecasting";

import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { ForecastFilters } from "@/components/forecasting/ForecastFilters";
import { ScenarioManagement } from "@/components/forecasting/ScenarioManagement";
import { useToast } from "@/hooks/use-toast";
import { DecompositionTab } from "@/components/forecasting/tabs/DecompositionTab";
import { ValidationTab } from "@/components/forecasting/tabs/ValidationTab";
import { ExternalFactorsTab } from "@/components/forecasting/tabs/ExternalFactorsTab";
import { ModelTestingTab } from "@/components/forecasting/tabs/ModelTestingTab";
import { ForecastAnalysisTab } from "@/components/forecasting/tabs/ForecastAnalysisTab";
import { ForecastDistributionTab } from "@/components/forecasting/tabs/ForecastDistributionTab";
import { WhatIfAnalysisTab } from "@/components/forecasting/tabs/WhatIfAnalysisTab";
import { WeatherData, MarketEvent, PriceAnalysis } from '@/types/weatherAndEvents';
import { ModelParametersDialog } from "@/components/forecasting/ModelParametersDialog";
import { defaultModelConfigs } from "@/types/modelParameters";

import {
  forecastData as defaultForecastData,
  forecastingModels as defaultForecastingModels,
  savedScenarios as defaultSavedScenarios,
  regions as defaultRegions,
  cities as defaultCities,
  channelTypes as defaultChannelTypes,
  warehouses as defaultWarehouses
} from "@/constants/forecasting";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const forecastData = defaultForecastData;
const forecastingModels = defaultForecastingModels;
const savedScenarios = defaultSavedScenarios;
const regions = defaultRegions;
const cities = defaultCities;
const channelTypes = defaultChannelTypes;
const warehouses = defaultWarehouses;

const Forecasting = () => {
  const [selectedModel, setSelectedModel] = useState("moving-avg");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)));
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

  const [metrics, setMetrics] = useState(() => calculateMetrics([], []));
  const [confidenceIntervals, setConfidenceIntervals] = useState<{ upper: number; lower: number }[]>([]);
  const [decomposition, setDecomposition] = useState(() => decomposeSeasonality([]));
  const [validationResults, setValidationResults] = useState(() => validateForecast([], []));
  const [crossValidationResults, setCrossValidationResults] = useState(() => performCrossValidation([]));
  const [weatherLocation, setWeatherLocation] = useState("Riyadh");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<MarketEvent>>({});
  const [priceAnalysis, setPriceAnalysis] = useState<PriceAnalysis | null>(null);
  const [historicalPriceData, setHistoricalPriceData] = useState<Array<{ price: number; demand: number }>>([]);

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

  const filteredData = useMemo(() => {
    return forecastData.filter(item => {
      const itemDate = new Date(item.week);
      if (!(itemDate >= fromDate && itemDate <= toDate)) return false;
      
      if (selectedRegion !== "all" && item.region !== selectedRegion) return false;
      if (selectedCity !== "all" && item.city !== selectedCity) return false;
      if (selectedChannel !== "all" && item.channel !== selectedChannel) return false;
      if (selectedWarehouse !== "all" && item.warehouse !== selectedWarehouse) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (selectedSubcategory !== "all" && item.subcategory !== selectedSubcategory) return false;
      if (selectedSku !== "all" && item.sku !== selectedSku) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.week.toLowerCase().includes(query) ||
          item.region.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query) ||
          item.channel.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.subcategory.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedRegion, selectedCity, selectedChannel, selectedWarehouse, selectedCategory, selectedSubcategory, selectedSku, searchQuery, fromDate, toDate]);

  useEffect(() => {
    const actuals = filteredData.map(d => d.actual).filter((a): a is number => a !== null);
    const forecasts = filteredData.map(d => d.forecast);
    
    setMetrics(calculateMetrics(actuals, forecasts));
    setConfidenceIntervals(calculateConfidenceIntervals(forecasts));
    setDecomposition(decomposeSeasonality(forecasts));
    setValidationResults(validateForecast(actuals, forecasts));
    setCrossValidationResults(performCrossValidation(forecasts));
  }, [filteredData]);

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

  const addHistoricalPricePoint = (price: number, demand: number) => {
    setHistoricalPriceData(prev => [...prev, { price, demand }]);
  };

  const calculatePriceAnalysis = () => {
    const analysis = historicalPriceData.reduce((acc, point) => {
      return {
        averagePrice: (acc.averagePrice || 0) + point.price / historicalPriceData.length,
        averageDemand: (acc.averageDemand || 0) + point.demand / historicalPriceData.length
      };
    }, { averagePrice: 0, averageDemand: 0 });

    setPriceAnalysis({
      elasticity: 0, // Placeholder
      optimalPrice: analysis.averagePrice,
      projectedDemand: analysis.averageDemand
    });
  };

  const fetchWeatherForecast = async () => {
    try {
      console.log("Fetching weather forecast for:", weatherLocation);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  {modelConfigs.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedModel && (
                <ModelParametersDialog
                  model={modelConfigs.find(m => m.id === selectedModel)!}
                  onParametersChange={(modelId, parameters) => 
                    setModelConfigs(prev =>
                      prev.map(config =>
                        config.id === modelId ? { ...config, parameters } : config
                      )
                    )
                  }
                />
              )}
              <Button 
                variant="outline" 
                onClick={findBestModel}
                className="flex items-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                Find Best Model
              </Button>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => date && setFromDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "MMM dd, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={(date) => date && setToDate(date)}
                      initialFocus
                      fromDate={fromDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button variant="outline" onClick={handleExport}>
                <FileDown className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="testing">Model Testing</TabsTrigger>
            <TabsTrigger value="forecast">Forecast Analysis</TabsTrigger>
            <TabsTrigger value="distribution">Forecast Distribution</TabsTrigger>
            <TabsTrigger value="decomposition">Pattern Analysis</TabsTrigger>
            <TabsTrigger value="scenarios">What-If Analysis</TabsTrigger>
            <TabsTrigger value="validation">Forecast Validation</TabsTrigger>
            <TabsTrigger value="external">External Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="testing">
            <ModelTestingTab
              historicalData={historicalData}
              predictedData={[]}
            />
          </TabsContent>

          <TabsContent value="forecast">
            <ForecastAnalysisTab
              filteredData={filteredData}
              confidenceIntervals={confidenceIntervals}
            />
          </TabsContent>

          <TabsContent value="distribution">
            <ForecastDistributionTab forecastTableData={forecastTableData} />
          </TabsContent>

          <TabsContent value="decomposition">
            <DecompositionTab
              filteredData={filteredData}
              decomposition={decomposition}
            />
          </TabsContent>

          <TabsContent value="scenarios">
            <WhatIfAnalysisTab
              filteredData={filteredData}
              whatIfScenario={[]}
            />
          </TabsContent>

          <TabsContent value="validation">
            <ValidationTab
              validationResults={validationResults}
              crossValidationResults={crossValidationResults}
            />
          </TabsContent>

          <TabsContent value="external">
            <ExternalFactorsTab
              weatherLocation={weatherLocation}
              setWeatherLocation={setWeatherLocation}
              weatherData={weatherData}
              fetchWeatherForecast={fetchWeatherForecast}
              marketEvents={marketEvents}
              setMarketEvents={setMarketEvents}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              priceAnalysis={priceAnalysis}
              addHistoricalPricePoint={addHistoricalPricePoint}
              calculatePriceAnalysis={calculatePriceAnalysis}
              historicalPriceData={historicalPriceData}
            />
          </TabsContent>
        </Tabs>

        <ScenarioManagement
          scenarioName={scenarioName}
          setScenarioName={setScenarioName}
          savedScenarios={savedScenarios}
          selectedScenario={selectedScenario}
          setSelectedScenario={setSelectedScenario}
        />
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
