
export interface PriceData {
  basePrice: number;
  discountRate?: number;
  promotionalPrice?: number;
  competitorPrices?: { [competitor: string]: number };
  historicalPrices?: { date: string; price: number }[];
  elasticity: number;
}

export interface PriceAnalysis {
  priceElasticity: number;
  optimalPrice: number;
  priceThresholds: {
    min: number;
    max: number;
    optimal: number;
  };
  competitivePriceIndex?: number;
}

export const calculatePriceImpact = (
  baselineDemand: number,
  priceData: PriceData
): number => {
  const { basePrice, promotionalPrice, elasticity } = priceData;
  const effectivePrice = promotionalPrice || basePrice;
  
  const priceChange = (effectivePrice - basePrice) / basePrice;
  const demandChange = priceChange * elasticity;
  
  return baselineDemand * (1 + demandChange);
};

export const analyzePriceSensitivity = (
  historicalData: { price: number; demand: number }[]
): PriceAnalysis => {
  const avgPrice = historicalData.reduce((sum, d) => sum + d.price, 0) / historicalData.length;
  const avgDemand = historicalData.reduce((sum, d) => sum + d.demand, 0) / historicalData.length;
  
  const numerator = historicalData.reduce((sum, d) => {
    return sum + ((d.demand - avgDemand) * (d.price - avgPrice));
  }, 0);
  
  const denominator = historicalData.reduce((sum, d) => {
    return sum + Math.pow(d.price - avgPrice, 2);
  }, 0);
  
  const elasticity = (numerator / denominator) * (avgPrice / avgDemand);
  
  const prices = historicalData.map(d => d.price);
  const optimalPrice = prices.reduce((a, b) => 
    historicalData.find(d => d.price === a)!.demand * a > 
    historicalData.find(d => d.price === b)!.demand * b ? a : b
  );
  
  return {
    priceElasticity: elasticity,
    optimalPrice,
    priceThresholds: {
      min: Math.min(...prices),
      max: Math.max(...prices),
      optimal: optimalPrice
    }
  };
};
