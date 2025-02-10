
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { ForecastingHeader } from "@/components/forecasting/ForecastingHeader";
import { ForecastingDateRange } from "@/components/forecasting/ForecastingDateRange";
import { ForecastingTabs } from "@/components/forecasting/ForecastingTabs";
import { ForecastFilters } from "@/components/forecasting/ForecastFilters";
import { ScenarioManagement } from "@/components/forecasting/ScenarioManagement";
import { useModelParameters } from "@/hooks/useModelParameters";
import { defaultModelConfigs } from "@/types/modelParameters";
import { type WeatherData, type MarketEvent, type PriceAnalysis } from '@/types/weatherAndEvents';
import {
  calculateMetrics,
  calculateConfidenceIntervals,
  decomposeSeasonality,
  validateForecast,
  performCrossValidation,
  findBestFitModel,
} from "@/utils/forecasting";

import {
  forecastData as defaultForecastData,
  forecastingModels as defaultForecastingModels,
  savedScenarios as defaultSavedScenarios,
  regions as defaultRegions,
  cities as defaultCities,
  channelTypes as defaultChannelTypes,
  warehouses as defaultWarehouses
} from "@/constants/forecasting";

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
      priceElasticity: 0, // Changed from elasticity to match PriceAnalysis type
      optimalPrice: analysis.averagePrice,
      priceThresholds: {
        min: Math.min(...historicalPriceData.map(d => d.price)),
        max: Math.max(...historicalPriceData.map(d => d.price)),
        optimal: analysis.averagePrice
      }
    });
  };

  const fetchWeatherForecast = async () => {
    try {
      console.log("Fetching weather forecast for:", weatherLocation);
      return {
        temperature: 25,
        precipitation: 0,
        humidity: 50,
        windSpeed: 10,
        weatherCondition: "sunny"
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <ForecastingHeader
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            handleExport={handleExport}
            findBestModel={findBestModel}
            modelConfigs={modelConfigs}
          />

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
    </DashboardLayout>
  );
};

export default Forecasting;
