
import { useState, useMemo, useEffect } from "react";
import { calculateMetrics, calculateConfidenceIntervals, decomposeSeasonality, validateForecast, performCrossValidation } from "@/utils/forecasting";
import { type WeatherData, type MarketEvent, type PriceAnalysis } from '@/types/weatherAndEvents';
import { forecastData as defaultForecastData } from "@/constants/forecasting";

export const useForecastData = (
  selectedRegion: string,
  selectedCity: string,
  selectedChannel: string,
  selectedWarehouse: string,
  selectedCategory: string,
  selectedSubcategory: string,
  selectedSku: string,
  searchQuery: string,
  fromDate: Date,
  toDate: Date
) => {
  const filteredData = useMemo(() => {
    return defaultForecastData.filter(item => {
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

  const [metrics, setMetrics] = useState(() => calculateMetrics([], []));
  const [confidenceIntervals, setConfidenceIntervals] = useState<{ upper: number; lower: number }[]>([]);
  const [decomposition, setDecomposition] = useState(() => decomposeSeasonality([]));
  const [validationResults, setValidationResults] = useState(() => validateForecast([], []));
  const [crossValidationResults, setCrossValidationResults] = useState(() => performCrossValidation([]));

  useEffect(() => {
    const actuals = filteredData.map(d => d.actual).filter((a): a is number => a !== null);
    const forecasts = filteredData.map(d => d.forecast);
    
    setMetrics(calculateMetrics(actuals, forecasts));
    setConfidenceIntervals(calculateConfidenceIntervals(forecasts));
    setDecomposition(decomposeSeasonality(forecasts));
    setValidationResults(validateForecast(actuals, forecasts));
    setCrossValidationResults(performCrossValidation(forecasts));
  }, [filteredData]);

  return {
    filteredData,
    metrics,
    confidenceIntervals,
    decomposition,
    validationResults,
    crossValidationResults
  };
};
