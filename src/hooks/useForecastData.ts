
import { useState, useMemo, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { calculateMetrics, calculateConfidenceIntervals, decomposeSeasonality, validateForecast, performCrossValidation } from "@/utils/forecasting";
import { type ForecastDataPoint, type ForecastOutlier, type SeasonalityPattern } from '@/types/forecasting';
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
  const [metrics, setMetrics] = useState({ mape: 0, mae: 0, rmse: 0 });
  const [confidenceIntervals, setConfidenceIntervals] = useState<{ upper: number; lower: number }[]>([]);
  const [decomposition, setDecomposition] = useState<{ trend: (number | null)[]; seasonal: (number | null)[] }>({ trend: [], seasonal: [] });
  const [validationResults, setValidationResults] = useState({ biasTest: false, residualNormality: false, heteroskedasticityTest: false });
  const [crossValidationResults, setCrossValidationResults] = useState({
    trainMetrics: { mape: 0, mae: 0, rmse: 0 },
    testMetrics: { mape: 0, mae: 0, rmse: 0 },
    validationMetrics: { mape: 0, mae: 0, rmse: 0 }
  });
  
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    return defaultForecastData.map(item => ({
      ...item,
      id: crypto.randomUUID(), // Add id to each data point
    })).filter(item => {
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

  const detectOutliers = async (data: ForecastDataPoint[]) => {
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

      const typedOutliers: ForecastOutlier[] = savedOutliers.map(outlier => ({
        ...outlier,
        metadata: outlier.metadata as Record<string, any>
      }));

      setOutliers(typedOutliers);
    } catch (error) {
      console.error('Error detecting outliers:', error);
      toast({
        title: "Error",
        description: "Failed to detect outliers",
        variant: "destructive",
      });
    }
  };

  const analyzeSeasonality = async (data: ForecastDataPoint[]) => {
    try {
      const decomposed = decomposeSeasonality(data.map(d => d.actual).filter((a): a is number => a !== null));
      
      const seasonalityData = {
        pattern_type: 'multiplicative',
        frequency: 12, // Monthly seasonality
        strength: 0.8,
        configuration: {
          trend: decomposed.trend,
          seasonal: decomposed.seasonal
        }
      };

      const { data: savedPattern, error } = await supabase
        .from('seasonality_patterns')
        .insert(seasonalityData)
        .select();

      if (error) throw error;

      const typedPatterns: SeasonalityPattern[] = savedPattern.map(pattern => ({
        ...pattern,
        configuration: pattern.configuration as Record<string, any>,
        metadata: pattern.metadata as Record<string, any>
      }));

      setSeasonalityPatterns(typedPatterns);
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
