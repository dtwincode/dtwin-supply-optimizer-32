
import { type ModelMetrics } from './metrics';

export const calculateConfidenceIntervals = (forecast: number[], confidence: number = 0.95) => {
  const z = 1.96; // 95% confidence interval
  const std = Math.sqrt(forecast.reduce((sum, f) => sum + Math.pow(f - (forecast.reduce((a, b) => a + b) / forecast.length), 2), 0) / forecast.length);
  
  return forecast.map(f => ({
    upper: f + z * std,
    lower: f - z * std
  }));
};

export const decomposeSeasonality = (data: number[]) => {
  const movingAverage = data.map((_, i) => {
    if (i < 2 || i > data.length - 3) return null;
    return (data[i-2] + data[i-1] + data[i] + data[i+1] + data[i+2]) / 5;
  });

  const seasonal = data.map((d, i) => 
    movingAverage[i] ? d - movingAverage[i]! : null
  );

  return {
    trend: movingAverage,
    seasonal: seasonal
  };
};

export interface CrossValidationResult {
  trainMetrics: ModelMetrics;
  testMetrics: ModelMetrics;
  validationMetrics: ModelMetrics;
}

export const performCrossValidation = (
  data: number[],
  folds: number = 5
): CrossValidationResult => {
  // Simple implementation for demonstration
  const metrics = {
    mape: 0,
    mae: 0,
    rmse: 0
  };
  
  return {
    trainMetrics: metrics,
    testMetrics: metrics,
    validationMetrics: metrics
  };
};
