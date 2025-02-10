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

export interface ModelFitResult {
  modelId: string;
  modelName: string;
  metrics: ModelMetrics;
  score: number;
}

export const findBestFitModel = (
  actual: number[],
  modelResults: { modelId: string; modelName: string; forecast: number[] }[]
): ModelFitResult => {
  const results = modelResults.map(({ modelId, modelName, forecast }) => {
    const metrics = calculateMetrics(actual, forecast);
    
    // Calculate a composite score (lower is better)
    // Weighted average of normalized metrics
    const score = (
      0.4 * metrics.mape + 
      0.3 * metrics.mae + 
      0.3 * metrics.rmse
    );

    return {
      modelId,
      modelName,
      metrics,
      score
    };
  });

  // Sort by score (lower is better) and return the best model
  return results.sort((a, b) => a.score - b.score)[0];
};
