
interface OptimizedParameters {
  modelId: string;
  parameters: { name: string; value: number }[];
}

const detectSeasonality = (data: number[]): boolean => {
  if (!data || data.length < 12) {
    return false;
  }
  
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const normalized = data.map(x => x - mean);
  
  const correlation = normalized.slice(12).reduce((sum, _, i) => 
    sum + (normalized[i] * normalized[i + 12]), 0);
    
  return correlation > 0.3;
};

const calculateVolatility = (data: number[]): number => {
  if (!data || data.length < 2) {
    return 0.1; // Default value for insufficient data
  }

  const returns = data.slice(1).map((value, i) => 
    (value - data[i]) / data[i]
  );
  
  const stdDev = Math.sqrt(
    returns.reduce((sum, r) => sum + r * r, 0) / returns.length
  );
  
  return Math.min(Math.max(stdDev, 0.1), 0.9);
};

const optimizeARIMAOrders = (data: number[]): { p: number; d: number; q: number } => {
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

export const optimizeModelParameters = (data: number[]): OptimizedParameters[] => {
  if (!data || data.length === 0) {
    return [];
  }

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
