
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCondition: string;
  alert: string | null;
}

export interface MarketEvent {
  id?: string;
  name: string;
  date: string;
  impact: number;
  description?: string;
}

export interface PriceAnalysis {
  priceElasticity: number;
  optimalPrice: number;
  priceThresholds: {
    min: number;
    max: number;
    optimal: number;
  };
}
