
interface ModelParameters {
  [key: string]: number;
}

interface TestDataConfig {
  length: number;
  modelType: string;
  parameters: ModelParameters;
}

export const generateTestData = (config: TestDataConfig): number[] => {
  const { length, modelType, parameters } = config;
  
  switch(modelType) {
    case "moving-avg":
      return generateMovingAverageData(length, parameters.windowSize);
    case "exp-smoothing":
      return generateExpSmoothingData(length, parameters.alpha, parameters.beta, parameters.gamma);
    case "arima":
      return generateArimaData(length, parameters.p, parameters.d, parameters.q);
    case "prophet":
      return generateProphetData(length, parameters.changePointPrior, parameters.seasonalityPrior);
    default:
      return [];
  }
};

const generateMovingAverageData = (length: number, windowSize: number): number[] => {
  const baseValue = 1000;
  const data: number[] = [];
  
  for (let i = 0; i < length; i++) {
    const trend = i * (baseValue * 0.01);
    const seasonality = Math.sin(2 * Math.PI * i / 52) * (baseValue * 0.1);
    const noise = (Math.random() - 0.5) * (baseValue * 0.05);
    data.push(baseValue + trend + seasonality + noise);
  }
  
  return data;
};

const generateExpSmoothingData = (length: number, alpha: number, beta: number, gamma: number): number[] => {
  const baseValue = 1000;
  const data: number[] = [];
  let level = baseValue;
  let trend = 5;
  
  for (let i = 0; i < length; i++) {
    const seasonal = Math.sin(2 * Math.PI * i / 52) * (baseValue * gamma);
    const noise = (Math.random() - 0.5) * (baseValue * 0.05);
    
    level = alpha * (level + trend) + (1 - alpha) * level;
    trend = beta * (level - data[i-1] || level) + (1 - beta) * trend;
    
    data.push(level + trend + seasonal + noise);
  }
  
  return data;
};

const generateArimaData = (length: number, p: number, d: number, q: number): number[] => {
  const baseValue = 1000;
  const data: number[] = [];
  let prevValues: number[] = Array(p).fill(baseValue);
  let prevErrors: number[] = Array(q).fill(0);
  
  for (let i = 0; i < length; i++) {
    let value = baseValue;
    
    // AR component
    for (let j = 0; j < p; j++) {
      value += 0.2 * prevValues[j];
    }
    
    // MA component
    for (let j = 0; j < q; j++) {
      value += 0.1 * prevErrors[j];
    }
    
    // Add differencing effect
    if (d > 0) {
      value += i * (baseValue * 0.01);
    }
    
    const error = (Math.random() - 0.5) * (baseValue * 0.05);
    value += error;
    
    data.push(value);
    prevValues.unshift(value);
    prevValues.pop();
    prevErrors.unshift(error);
    prevErrors.pop();
  }
  
  return data;
};

const generateProphetData = (length: number, changePointPrior: number, seasonalityPrior: number): number[] => {
  const baseValue = 1000;
  const data: number[] = [];
  
  for (let i = 0; i < length; i++) {
    const trend = i * (baseValue * changePointPrior);
    const seasonality = Math.sin(2 * Math.PI * i / 52) * (baseValue * seasonalityPrior);
    const noise = (Math.random() - 0.5) * (baseValue * 0.05);
    data.push(baseValue + trend + seasonality + noise);
  }
  
  return data;
};
