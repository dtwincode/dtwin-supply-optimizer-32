
import { PriceData } from './pricing';
import { ForecastDataPoint } from '@/types/forecasting';
import { calculatePriceImpact } from './pricing';

export interface Scenario {
  name: string;
  sku?: string;
  forecast: number[];
  assumptions: {
    growthRate: number;
    seasonality: number;
    events: { week: string; impact: number }[];
    priceData?: PriceData & { skuCode?: string };
  };
}

export const generateScenario = (
  baseline: number[],
  assumptions: {
    growthRate: number;
    seasonality: number;
    events: { week: string; impact: number }[];
    priceData?: PriceData & { skuCode?: string };
  },
  timeData: { week: string; date?: Date }[]
): number[] => {
  return baseline.map((value, index) => {
    const growth = value * (1 + assumptions.growthRate);
    // Adjust seasonality calculation for weekly pattern (52 weeks in a year)
    const seasonal = growth * (1 + Math.sin(index * 2 * Math.PI / 52) * assumptions.seasonality);
    const event = assumptions.events.find(e => e.week === timeData[index]?.week);
    const withEvents = seasonal * (event ? 1 + event.impact : 1);
    
    if (assumptions.priceData) {
      return calculatePriceImpact(withEvents, assumptions.priceData);
    }
    
    return withEvents;
  });
};

export const saveScenario = async (
  scenario: Scenario
): Promise<boolean> => {
  // Placeholder for saving to backend
  try {
    // Here you would typically make an API call to save the scenario
    console.log('Saving scenario:', scenario);
    return true;
  } catch (error) {
    console.error('Error saving scenario:', error);
    return false;
  }
};

export const getScenariosBySku = async (
  skuCode: string
): Promise<Scenario[]> => {
  // Placeholder for fetching from backend
  try {
    // Here you would typically make an API call to fetch scenarios for a specific SKU
    console.log('Fetching scenarios for SKU:', skuCode);
    return [];
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return [];
  }
};
