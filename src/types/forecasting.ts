
import { Json } from '@/integrations/supabase/types';

export interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  date: string;
}

export interface MarketEvent {
  id: string;
  name: string;
  date: string;
  impact: number;
  type: string;
}

export interface PriceData {
  date: string;
  price: number;
  volume: number;
}

export interface PriceAnalysis {
  elasticity: number;
  optimalPrice: number;
  priceRange: { min: number; max: number };
}

export interface SavedScenario {
  id: number;
  name: string;
  model: string;
  horizon: string;
}

export interface MarketEventType {
  value: string;
  label: string;
}

export interface MarketEventCategory {
  value: string;
  label: string;
}

export interface ForecastDataPoint {
  id: string;
  week: string;
  actual: number | null;
  forecast: number;
  variance: number | null;
  region: string;
  city: string;
  channel: string;
  warehouse: string;
  category: string;
  subcategory: string;
  sku: string;
}

export interface WhatIfParams {
  growthRate: number;
  seasonality: number;
  events: { week: string; impact: number }[];
  priceData?: PriceData;
}

export interface MacroFactors {
  gdpGrowth: number;
  inflation: number;
  exchangeRates: { [key: string]: number };
}

export interface ModelVersion {
  id: string;
  model_name: string;
  version: string;
  parameters: Record<string, any>;
  accuracy_metrics: {
    mape: number;
    mae: number;
    rmse: number;
  };
  metadata: Record<string, any>;
  validation_metrics: Record<string, any>;
  training_data_snapshot: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForecastAdjustment {
  id: string;
  forecast_id: string;
  previous_value: number;
  new_value: number;
  adjustment_reason: string;
  adjusted_by: string;
  adjusted_at: string;
  metadata: Record<string, any>;
}

export interface ForecastOutlier {
  id: string;
  data_point_id: string;
  detection_method: string;
  confidence_score: number;
  detected_at: string;
  is_verified: boolean;
  verified_by: string | null;
  metadata: Record<string, any>;
}

export interface SeasonalityPattern {
  id: string;
  dataset_id: string;
  pattern_type: string;
  frequency: number;
  strength: number;
  detected_at: string;
  last_updated_at: string;
  configuration: Record<string, any>;
  metadata: Record<string, any>;
}
