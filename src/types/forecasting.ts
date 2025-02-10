
import { WeatherData, MarketEvent, PriceData, PriceAnalysis } from "@/utils/forecasting";

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

