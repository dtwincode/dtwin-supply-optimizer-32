
export interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  weatherCondition: string;
  alert?: string | null;
}

export interface MarketEvent {
  id: string;
  type: 'competitor_action' | 'regulatory_change' | 'market_disruption' | 'technology_change' | 'economic_event';
  category: string;
  name: string;
  date: string;
  impact: number;
  description: string;
  source?: string;
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
