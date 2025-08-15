
import { useState } from "react";
import { type PriceAnalysis } from '@/types/weatherAndEvents';

export const usePriceAnalysis = () => {
  const [priceAnalysis, setPriceAnalysis] = useState<PriceAnalysis | null>(null);
  const [historicalPriceData, setHistoricalPriceData] = useState<Array<{ price: number; demand: number }>>([]);

  const addHistoricalPricePoint = (price: number, demand: number) => {
    setHistoricalPriceData(prev => [...prev, { price, demand }]);
  };

  const calculatePriceAnalysis = () => {
    const analysis = historicalPriceData.reduce((acc, point) => {
      return {
        averagePrice: (acc.averagePrice || 0) + point.price / historicalPriceData.length,
        averageDemand: (acc.averageDemand || 0) + point.demand / historicalPriceData.length
      };
    }, { averagePrice: 0, averageDemand: 0 });

    setPriceAnalysis({
      priceElasticity: 0,
      optimalPrice: analysis.averagePrice,
      priceThresholds: {
        min: Math.min(...historicalPriceData.map(d => d.price)),
        max: Math.max(...historicalPriceData.map(d => d.price)),
        optimal: analysis.averagePrice
      }
    });
  };

  return {
    priceAnalysis,
    historicalPriceData,
    addHistoricalPricePoint,
    calculatePriceAnalysis
  };
};
