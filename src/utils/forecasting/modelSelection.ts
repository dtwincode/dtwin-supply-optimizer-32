
import { ModelMetrics } from './metricsCalculation';
import { optimizeModelParameters } from './modelOptimization';
import { calculateMetrics } from './metricsCalculation';

export interface ModelFitResult {
  modelId: string;
  modelName: string;
  metrics: ModelMetrics;
  score: number;
  optimizedParameters?: { name: string; value: number }[];
}

export const findBestFitModel = (
  actual: number[],
  modelResults: { modelId: string; modelName: string; forecast: number[] }[]
): ModelFitResult => {
  const optimizedParams = optimizeModelParameters(actual);
  
  const results = modelResults.map(({ modelId, modelName, forecast }) => {
    const metrics = calculateMetrics(actual, forecast);
    
    // Calculate a composite score (lower is better)
    const score = (
      0.4 * metrics.mape + 
      0.3 * metrics.mae + 
      0.3 * metrics.rmse
    );

    return {
      modelId,
      modelName,
      metrics,
      score,
      optimizedParameters: optimizedParams.find(p => p.modelId === modelId)?.parameters
    };
  });

  // Sort by score (lower is better) and return the best model
  return results.sort((a, b) => a.score - b.score)[0];
};

export const getModelExample = (modelId: string, data: number[]) => {
  switch (modelId) {
    case "moving-avg":
      return {
        description: "Best for stable data with minimal seasonality",
        recommendedParams: {
          windowSize: Math.min(Math.ceil(Math.sqrt(data.length)), 12)
        },
        bestUseCase: "Short-term forecasting of stable demand"
      };
    case "exp-smoothing":
      return {
        description: "Effective for data with trends and seasonality",
        recommendedParams: {
          alpha: 0.3,
          beta: 0.1,
          gamma: optimizeModelParameters(data).find(p => p.modelId === "exp-smoothing")?.parameters.find(p => p.name === "gamma")?.value || 0.1
        },
        bestUseCase: "Medium-term forecasting with seasonal patterns"
      };
    case "arima":
      const { p, d, q } = optimizeARIMAOrders(data);
      return {
        description: "Powerful for complex time series with multiple patterns",
        recommendedParams: { p, d, q },
        bestUseCase: "Long-term forecasting with complex patterns"
      };
    case "prophet":
      return {
        description: "Handles multiple seasonalities and holiday effects",
        recommendedParams: {
          changePointPrior: 0.05,
          seasonalityPrior: 10,
          holidaysPrior: 10
        },
        bestUseCase: "Forecasting with multiple seasonal patterns and events"
      };
    default:
      return {
        description: "General purpose forecasting model",
        recommendedParams: {},
        bestUseCase: "Various forecasting scenarios"
      };
  }
};
