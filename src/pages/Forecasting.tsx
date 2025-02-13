
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { ForecastingContainer } from "@/components/forecasting/ForecastingContainer";
import { useForecastData } from "@/hooks/useForecastData";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useMarketEvents } from "@/hooks/useMarketEvents";
import { usePriceAnalysis } from "@/hooks/usePriceAnalysis";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export const ForecastingProvider = () => {
  // Initialize all the necessary state and hooks
  const [fromDate] = useState<Date>(new Date('2024-01-01'));
  const [toDate] = useState<Date>(new Date('2024-12-26'));
  const [selectedModel] = useState("moving-avg");
  const [selectedRegion] = useState("all");
  const [selectedCity] = useState("all");
  const [selectedChannel] = useState("all");
  const [selectedL1MainProd] = useState("all");
  const [selectedL2ProdLine] = useState("all");
  const [selectedL3ProdCategory] = useState("all");

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
    "",
    "",
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

  // Generate sample forecast table data
  const [forecastTableData] = useState(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      week: `Week ${i + 1}`,
      forecast: Math.round(1000 * (1 + 0.01 * i)),
      lower: Math.round(900 * (1 + 0.01 * i)),
      upper: Math.round(1100 * (1 + 0.01 * i))
    }));
  });

  // Create a context value object with all the data and functions
  const contextValue = {
    filteredData,
    confidenceIntervals,
    decomposition,
    validationResults,
    crossValidationResults,
    weatherLocation,
    setWeatherLocation,
    weatherData,
    fetchWeatherForecast,
    marketEvents,
    setMarketEvents,
    newEvent,
    setNewEvent,
    priceAnalysis,
    historicalPriceData,
    addHistoricalPricePoint,
    calculatePriceAnalysis,
    forecastTableData
  };

  return (
    <DashboardLayout>
      <Outlet context={contextValue} />
    </DashboardLayout>
  );
};

const Forecasting = () => {
  return (
    <DashboardLayout>
      <ForecastingContainer />
    </DashboardLayout>
  );
};

export default Forecasting;
