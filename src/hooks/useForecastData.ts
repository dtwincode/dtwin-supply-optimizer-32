import { useState, useMemo, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { calculateMetrics, calculateConfidenceIntervals, decomposeSeasonality, validateForecast, performCrossValidation } from "@/utils/forecasting";
import { type WeatherData, type MarketEvent, type PriceAnalysis, type ForecastOutlier, type SeasonalityPattern } from '@/types/forecasting';
import { forecastData as defaultForecastData } from "@/constants/forecasting";
import { useToast } from "@/components/ui/use-toast";

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
  const [outliers, setOutliers] = useState<ForecastOutlier[]>([]);
  const [seasonalityPatterns, setSeasonalityPatterns] = useState<SeasonalityPattern[]>([]);
  const { toast } = useToast();

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

  const detectOutliers = async (data: typeof filteredData) => {
    try {
      const outlierPoints = data.filter(point => {
        const avg = data.reduce((sum, p) => sum + (p.actual || 0), 0) / data.length;
        const stdDev = Math.sqrt(
          data.reduce((sum, p) => sum + Math.pow((p.actual || 0) - avg, 2), 0) / data.length
        );
        return Math.abs((point.actual || 0) - avg) > 2 * stdDev;
      });

      const { data: savedOutliers, error } = await supabase
        .from('forecast_outliers')
        .insert(
          outlierPoints.map(point => ({
            data_point_id: point.id,
            detection_method: 'z-score',
            confidence_score: 0.95,
            metadata: { threshold: 2 }
          }))
        )
        .select();

      if (error) throw error;
      setOutliers(savedOutliers);
    } catch (error) {
      console.error('Error detecting outliers:', error);
      toast({
        title: "Error",
        description: "Failed to detect outliers",
        variant: "destructive",
      });
    }
  };

  const analyzeSeasonality = async (data: typeof filteredData) => {
    try {
      const decomposed = decomposeSeasonality(data.map(d => d.actual).filter((a): a is number => a !== null));
      
      const { data: savedPattern, error } = await supabase
        .from('seasonality_patterns')
        .insert({
          pattern_type: 'multiplicative',
          frequency: decomposed.frequency,
          strength: decomposed.strength,
          configuration: decomposed.configuration,
          metadata: { analysis_date: new Date().toISOString() }
        })
        .select();

      if (error) throw error;
      setSeasonalityPatterns(savedPattern);
    } catch (error) {
      console.error('Error analyzing seasonality:', error);
      toast({
        title: "Error",
        description: "Failed to analyze seasonality patterns",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const actuals = filteredData.map(d => d.actual).filter((a): a is number => a !== null);
    const forecasts = filteredData.map(d => d.forecast);
    
    setMetrics(calculateMetrics(actuals, forecasts));
    setConfidenceIntervals(calculateConfidenceIntervals(forecasts));
    setDecomposition(decomposeSeasonality(forecasts));
    setValidationResults(validateForecast(actuals, forecasts));
    setCrossValidationResults(performCrossValidation(forecasts));
  }, [filteredData]);

  useEffect(() => {
    if (filteredData.length > 0) {
      detectOutliers(filteredData);
      analyzeSeasonality(filteredData);
    }
  }, [filteredData]);

  return {
    filteredData,
    metrics,
    confidenceIntervals,
    decomposition,
    validationResults,
    crossValidationResults,
    outliers,
    seasonalityPatterns
  };
};
