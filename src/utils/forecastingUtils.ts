
export interface ModelMetrics {
  mape: number;
  mae: number;
  rmse: number;
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

export interface Scenario {
  name: string;
  forecast: number[];
  assumptions: {
    growthRate: number;
    seasonality: number;
    events: { month: string; impact: number }[];
  };
}

export const generateScenario = (
  baseline: number[],
  assumptions: {
    growthRate: number;
    seasonality: number;
    events: { month: string; impact: number }[];
  }
): number[] => {
  return baseline.map((value, index) => {
    const growth = value * (1 + assumptions.growthRate);
    const seasonal = growth * (1 + Math.sin(index * 2 * Math.PI / 12) * assumptions.seasonality);
    const event = assumptions.events.find(e => e.month === forecastData[index]?.month);
    return seasonal * (event ? 1 + event.impact : 1);
  });
};
