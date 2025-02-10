
import { PriceData } from './pricing';
import { ForecastDataPoint } from './productFilters';
import { calculatePriceImpact } from './pricing';

export interface Scenario {
  name: string;
  forecast: number[];
  assumptions: {
    growthRate: number;
    seasonality: number;
    events: { week: string; impact: number }[];
    priceData?: PriceData;
  };
}

export const generateScenario = (
  baseline: number[],
  assumptions: {
    growthRate: number;
    seasonality: number;
    events: { week: string; impact: number }[];
    priceData?: PriceData;
  },
  timeData: ForecastDataPoint[]
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
