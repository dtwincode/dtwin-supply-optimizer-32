
import { PriceData } from './pricing';
import { ForecastDataPoint } from './productFilters';
import { calculatePriceImpact } from './pricing';

export interface Scenario {
  name: string;
  forecast: number[];
  assumptions: {
    growthRate: number;
    seasonality: number;
    events: { month: string; impact: number }[];
    priceData?: PriceData;
  };
}

export const generateScenario = (
  baseline: number[],
  assumptions: {
    growthRate: number;
    seasonality: number;
    events: { month: string; impact: number }[];
    priceData?: PriceData;
  },
  timeData: ForecastDataPoint[]
): number[] => {
  return baseline.map((value, index) => {
    const growth = value * (1 + assumptions.growthRate);
    const seasonal = growth * (1 + Math.sin(index * 2 * Math.PI / 12) * assumptions.seasonality);
    const event = assumptions.events.find(e => e.month === timeData[index]?.month);
    const withEvents = seasonal * (event ? 1 + event.impact : 1);
    
    if (assumptions.priceData) {
      return calculatePriceImpact(withEvents, assumptions.priceData);
    }
    
    return withEvents;
  });
};
