export interface ModelMetrics {
  mape: number;
  mae: number;
  rmse: number;
  r2?: number;
  aic?: number;
}

export const calculateMetrics = (actual: number[], forecast: number[]): ModelMetrics => {
  const nonNullPairs = actual.map((a, i) => [a, forecast[i]])
    .filter(([a]) => a !== null);

  const errors = nonNullPairs.map(([a, f]) => Math.abs(a! - f!));
  const squaredErrors = errors.map(e => e * e);

  const mape = (nonNullPairs.reduce((sum, [a, f]) => sum + Math.abs((a! - f!) / a!), 0) / nonNullPairs.length) * 100;
  const mae = errors.reduce((sum, e) => sum + e, 0) / errors.length;
  const rmse = Math.sqrt(squaredErrors.reduce((sum, se) => sum + se, 0) / squaredErrors.length);

  return {
    mape: parseFloat(mape.toFixed(2)),
    mae: parseFloat(mae.toFixed(2)),
    rmse: parseFloat(rmse.toFixed(2))
  };
};

export const calculateAIC = (
  residuals: number[],
  numParameters: number
): number => {
  const n = residuals.length;
  const rss = residuals.reduce((sum, r) => sum + r * r, 0);
  return n * Math.log(rss / n) + 2 * numParameters;
};

export const calculateR2 = (actual: number[], predicted: number[]): number => {
  const mean = actual.reduce((sum, val) => sum + val, 0) / actual.length;
  const totalSum = actual.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
  const residualSum = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0);
  return 1 - (residualSum / totalSum);
};

interface OptimizedParameters {
  modelId: string;
  parameters: { name: string; value: number }[];
}

export const optimizeModelParameters = (data: number[]): OptimizedParameters[] => {
  const optimizedParams: OptimizedParameters[] = [];
  
  // Moving Average optimization
  const maOptimalWindow = Math.min(
    Math.ceil(Math.sqrt(data.length)), // Rule of thumb: square root of data length
    12 // Cap at 12 periods
  );
  optimizedParams.push({
    modelId: "moving-avg",
    parameters: [{ name: "windowSize", value: maOptimalWindow }]
  });

  // Exponential Smoothing optimization
  const seasonality = detectSeasonality(data);
  const volatility = calculateVolatility(data);
  optimizedParams.push({
    modelId: "exp-smoothing",
    parameters: [
      { name: "alpha", value: Math.min(0.8, volatility) }, // Higher alpha for volatile data
      { name: "beta", value: 0.1 }, // Conservative trend
      { name: "gamma", value: seasonality ? 0.3 : 0.1 } // Higher gamma if seasonal
    ]
  });

  // ARIMA optimization
  const { p, d, q } = optimizeARIMAOrders(data);
  optimizedParams.push({
    modelId: "arima",
    parameters: [
      { name: "p", value: p },
      { name: "d", value: d },
      { name: "q", value: q }
    ]
  });

  return optimizedParams;
};

// Helper functions for parameter optimization
const detectSeasonality = (data: number[]): boolean => {
  // Simple seasonality detection using autocorrelation
  const mean = data.reduce((a, b) => a + b) / data.length;
  const normalized = data.map(x => x - mean);
  const correlation = normalized.slice(12).reduce((sum, _, i) => 
    sum + (normalized[i] * normalized[i + 12]), 0);
  return correlation > 0.3;
};

const calculateVolatility = (data: number[]): number => {
  const returns = data.slice(1).map((value, i) => 
    (value - data[i]) / data[i]
  );
  const stdDev = Math.sqrt(
    returns.reduce((sum, r) => sum + r * r, 0) / returns.length
  );
  return Math.min(Math.max(stdDev, 0.1), 0.9);
};

const optimizeARIMAOrders = (data: number[]): { p: number; d: number; q: number } => {
  const differenced = data.slice(1).map((v, i) => v - data[i]);
  const isStationary = Math.abs(
    differenced.reduce((a, b) => a + b) / differenced.length
  ) < 0.1;

  return {
    p: 1, // Start with simple AR(1)
    d: isStationary ? 0 : 1, // Difference if non-stationary
    q: 1  // Start with simple MA(1)
  };
};

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
