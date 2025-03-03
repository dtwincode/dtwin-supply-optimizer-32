
import { Json } from '@/integrations/supabase/types';
import { ModelParameter } from '@/types/models/commonTypes';

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
  date?: string;
  basePrice: number;
  elasticity: number;
  historicalPrices: { date: string; price: number }[];
  promotionalPrice?: number;
  skuCode?: string;
}

export interface PriceAnalysis {
  elasticity: number;
  optimalPrice: number;
  priceRange: { min: number; max: number };
}

export interface SavedScenario {
  id: string;
  name: string;
  model: string;
  horizon: string;
  sku?: string;
  parameters?: Json;
  forecast_data?: Json;
  created_at?: string;
  updated_at?: string;
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
  l1_main_prod: string;
  l2_prod_line: string;
  l3_prod_category: string;
  l4_device_make: string;
  l5_prod_sub_category: string;
  l6_device_model: string;
  l7_device_color: string;
  l8_device_storage: string;
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
  pattern_type: string; // 'weekly' | 'monthly' | 'yearly'
  frequency: number;
  strength: number; // 0-1 scale
  detected_at: string;
  last_updated_at: string;
  configuration: Record<string, any>;
  metadata: Record<string, any>;
}

export interface ChangePoint {
  id: string;
  timestamp: string;
  confidence: number;
  type: 'level_shift' | 'trend_change' | 'variance_change';
  magnitude: number;
}

export interface StatisticalTest {
  name: string;
  statistic: number;
  pValue: number;
  criticalValues: Record<string, number>;
  result: 'significant' | 'not_significant';
}

export interface PatternAnomaly {
  id: string;
  timestamp: string;
  value: number;
  expected_value: number;
  deviation_score: number;
  type: 'outlier' | 'structural_break' | 'pattern_break';
  confidence: number;
}

export interface PatternAnalysisResult {
  seasonality: SeasonalityPattern[];
  changePoints: ChangePoint[];
  statisticalTests: StatisticalTest[];
  anomalies: PatternAnomaly[];
}

export interface SavedModelConfig {
  id: string;
  model_id: string;
  sku?: string;
  location_id?: string;
  parameters: ModelParameter[];
  created_at: string;
  performance_metrics?: {
    accuracy: number;
    trend: 'improving' | 'stable' | 'declining';
    trained_at: string;
    mape?: number;
    mae?: number;
    rmse?: number;
  };
}
