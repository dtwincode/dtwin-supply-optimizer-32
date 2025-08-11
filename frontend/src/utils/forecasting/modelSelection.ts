
import { ModelMetrics } from './metricsCalculation';
import { optimizeModelParameters } from './modelOptimization';
import { calculateMetrics } from './metricsCalculation';
import { ModelParameter } from '@/types/models/commonTypes';

export interface ModelFitResult {
  modelId: string;
  modelName: string;
  metrics: ModelMetrics;
  score: number;
  optimizedParameters?: ModelParameter[];
}

const optimizeARIMAOrders = (data: number[]) => {
  if (!data || data.length < 2) {
    return { p: 1, d: 0, q: 1 }; // Default values for insufficient data
  }

  const differenced = data.slice(1).map((v, i) => v - data[i]);
  const isStationary = Math.abs(
    differenced.reduce((sum, val) => sum + val, 0) / differenced.length
  ) < 0.1;

  return {
    p: 1, // Start with simple AR(1)
    d: isStationary ? 0 : 1, // Difference if non-stationary
    q: 1  // Start with simple MA(1)
  };
};

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

    // Ensure parameters include descriptions
    const baseParams = optimizedParams.find(p => p.modelId === modelId)?.parameters || [];
    const optimizedParameters = baseParams.map(param => ({
      ...param,
      description: getParameterDescription(modelId, param.name)
    }));

    return {
      modelId,
      modelName,
      metrics,
      score,
      optimizedParameters
    };
  });

  // Sort by score (lower is better) and return the best model
  return results.sort((a, b) => a.score - b.score)[0];
};

const getParameterDescription = (modelId: string, paramName: string): string => {
  const descriptions: Record<string, Record<string, string>> = {
    "arima": {
      p: "Number of autoregressive terms (p)",
      d: "Number of differences (d)",
      q: "Number of moving average terms (q)"
    },
    "exp-smoothing": {
      alpha: "Smoothing factor (α) for level",
      beta: "Smoothing factor (β) for trend",
      gamma: "Smoothing factor (γ) for seasonality"
    },
    // Add descriptions for other models and parameters
    "default": {
      windowSize: "Window size for the model",
      learningRate: "Learning rate for model training",
      epochs: "Number of training epochs"
    }
  };

  return descriptions[modelId]?.[paramName] || 
         descriptions.default[paramName] || 
         `Parameter ${paramName} for ${modelId} model`;
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
