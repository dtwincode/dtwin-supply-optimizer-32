
export interface MarketEvent {
  id: string;
  type: 'competitor_action' | 'regulatory_change' | 'market_disruption' | 'technology_change' | 'economic_event';
  name: string;
  date: string;
  impact: number;
  description: string;
  source?: string;
  category: string;
}

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
