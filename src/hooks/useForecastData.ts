
import { useState, useMemo, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { calculateMetrics, calculateConfidenceIntervals, decomposeSeasonality, validateForecast, performCrossValidation } from "@/utils/forecasting";
import { type ForecastDataPoint, type ForecastOutlier, type SeasonalityPattern } from '@/types/forecasting';
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
  const [data, setData] = useState<ForecastDataPoint[]>([]);
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

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching forecast data with filters:', {
          selectedRegion,
          selectedCity,
          selectedChannel,
          selectedWarehouse,
          selectedCategory,
          selectedSubcategory,
          selectedSku,
          fromDate,
          toDate
        });

        let query = supabase
          .from('forecast_data')
          .select('*')
          .gte('date', fromDate.toISOString().split('T')[0])
          .lte('date', toDate.toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (selectedRegion !== "all") {
          query = query.eq('region', selectedRegion);
        }
        if (selectedCity !== "all") {
          query = query.eq('city', selectedCity);
        }
        if (selectedChannel !== "all") {
          query = query.eq('channel', selectedChannel);
        }
        if (selectedWarehouse !== "all") {
          query = query.eq('warehouse', selectedWarehouse);
        }
        if (selectedCategory !== "all") {
          query = query.eq('category', selectedCategory);
        }
        if (selectedSubcategory !== "all") {
          query = query.eq('subcategory', selectedSubcategory);
        }
        if (selectedSku !== "all") {
          query = query.eq('sku', selectedSku);
        }

        const { data: forecastData, error } = await query;

        if (error) {
          console.error('Error fetching forecast data:', error);
          throw error;
        }

        console.log('Fetched forecast data:', forecastData);

        // Transform the data to match ForecastDataPoint type
        const transformedData: ForecastDataPoint[] = forecastData.map(item => ({
          id: item.id,
          week: item.date,
          actual: item.value,
          forecast: Math.round(item.value * (1 + (Math.random() * 0.2 - 0.1))), // Simulated forecast
          variance: Math.random() * 10,
          region: item.region || '',
          city: item.city || '',
          channel: item.channel || '',
          warehouse: item.warehouse || '',
          category: item.category || '',
          subcategory: item.subcategory || '',
          sku: item.sku || ''
        }));

        setData(transformedData);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch forecast data",
        });
      }
    };

    fetchData();
  }, [selectedRegion, selectedCity, selectedChannel, selectedWarehouse, selectedCategory, selectedSubcategory, selectedSku, fromDate, toDate, toast]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
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
  }, [data, searchQuery]);

  useEffect(() => {
    if (filteredData.length > 0) {
      const actuals = filteredData.map(d => d.actual).filter((a): a is number => a !== null);
      const forecasts = filteredData.map(d => d.forecast);
      
      setMetrics(calculateMetrics(actuals, forecasts));
      setConfidenceIntervals(calculateConfidenceIntervals(forecasts));
      setDecomposition(decomposeSeasonality(forecasts));
      setValidationResults(validateForecast(actuals, forecasts));
      setCrossValidationResults(performCrossValidation(forecasts));
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
