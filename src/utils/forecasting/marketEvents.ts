
import { MarketEvent } from '@/types/weatherAndEvents';

export type { MarketEvent };

export interface ExternalFactors {
  macroeconomic: {
    gdpGrowth: number;
    inflation: number;
    exchangeRates: { [key: string]: number };
  };
  competitive: {
    marketShare: number;
    competitorActions: string[];
  };
  seasonal: {
    weatherPatterns: string[];
    events: string[];
  };
}

export const adjustForecastWithExternalFactors = (
  baseline: number[],
  factors: ExternalFactors
): number[] => {
  return baseline.map(value => {
    let adjusted = value;
    adjusted *= (1 + factors.macroeconomic.gdpGrowth);
    adjusted *= (1 - factors.macroeconomic.inflation);
    return adjusted;
  });
};
