export interface ModelMetrics {
  mape: number;
  mae: number;
  rmse: number;
  r2?: number;  // Added R-squared metric
  aic?: number; // Added Akaike Information Criterion
}

export interface ProductHierarchy {
  category: string;
  subcategory?: string;
  sku?: string;
}

export interface ForecastDataPoint {
  month: string;
  category: string;
  subcategory?: string;
  sku?: string;
  promotionalEvent?: boolean;
  weatherImpact?: number;
  marketEvents?: string[];
  stockLevels?: number;
  priceElasticity?: number;
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
    priceData?: PriceData;
  };
}

export const generateScenario = (
  baseline: number[],
  assumptions: {
    growthRate: number;
    seasonality: number;
    events: { month: string; impact: number }[];
    priceData?: PriceData;
  },
  timeData: ForecastDataPoint[]
): number[] => {
  return baseline.map((value, index) => {
    const growth = value * (1 + assumptions.growthRate);
    const seasonal = growth * (1 + Math.sin(index * 2 * Math.PI / 12) * assumptions.seasonality);
    const event = assumptions.events.find(e => e.month === timeData[index]?.month);
    const withEvents = seasonal * (event ? 1 + event.impact : 1);
    
    // Apply price impact if price data is available
    if (assumptions.priceData) {
      return calculatePriceImpact(withEvents, assumptions.priceData);
    }
    
    return withEvents;
  });
};

export const filterByProductHierarchy = (
  data: ForecastDataPoint[],
  filters: ProductHierarchy
): ForecastDataPoint[] => {
  return data.filter(item => {
    const categoryMatch = !filters.category || item.category === filters.category;
    const subcategoryMatch = !filters.subcategory || item.subcategory === filters.subcategory;
    const skuMatch = !filters.sku || item.sku === filters.sku;
    return categoryMatch && subcategoryMatch && skuMatch;
  });
};

export const getUniqueValues = (data: ForecastDataPoint[], field: keyof ProductHierarchy): string[] => {
  const values = new Set(data.map(item => item[field]).filter(Boolean));
  return Array.from(values) as string[];
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
  const foldSize = Math.floor(data.length / folds);
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

export interface ForecastValidation {
  outOfSampleError: number;
  biasTest: boolean;
  residualNormality: boolean;
  heteroskedasticityTest: boolean;
}

export const validateForecast = (
  actual: number[],
  forecast: number[]
): ForecastValidation => {
  return {
    outOfSampleError: calculateMetrics(actual, forecast).mape,
    biasTest: true, // Implement actual statistical test
    residualNormality: true, // Implement Shapiro-Wilk or similar test
    heteroskedasticityTest: true // Implement White test or similar
  };
};

export interface ExternalFactors {
  macroeconomic: {
    gdpGrowth: number;
    inflation: number;
    exchangeRates: { [key: string]: number };
  };
  competitive: {
    marketShare: number;
    competitorActions: string[];
  };
  seasonal: {
    weatherPatterns: string[];
    events: string[];
  };
}

export const adjustForecastWithExternalFactors = (
  baseline: number[],
  factors: ExternalFactors
): number[] => {
  return baseline.map(value => {
    let adjusted = value;
    adjusted *= (1 + factors.macroeconomic.gdpGrowth);
    adjusted *= (1 - factors.macroeconomic.inflation);
    // Add more sophisticated adjustments based on other factors
    return adjusted;
  });
};

export interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  weatherCondition: string;
  alert?: string;
}

export interface MarketEvent {
  id: string;
  type: 'competitor_action' | 'regulatory_change' | 'market_disruption' | 'technology_change' | 'economic_event';
  name: string;
  date: string;
  impact: number; // -1 to 1 scale
  description: string;
  source?: string;
  category: string;
}

export interface WeatherPattern {
  location: string;
  date: string;
  forecast: WeatherData;
  historicalAverage?: WeatherData;
  impactScore: number; // -1 to 1 scale
}

export const calculateWeatherImpact = (weatherData: WeatherData, productCategory: string): number => {
  let impactScore = 0;
  
  // Calculate impact based on weather conditions and product category
  switch (productCategory.toLowerCase()) {
    case 'beverages':
      impactScore += (weatherData.temperature - 20) * 0.05; // Higher temps increase beverage sales
      break;
    case 'winter clothing':
      impactScore -= weatherData.temperature * 0.03; // Lower temps increase winter clothing sales
      break;
    case 'electronics':
      // Extreme conditions might affect electronics sales
      if (weatherData.humidity > 80) impactScore -= 0.2;
      break;
    default:
      // Default impact calculation
      if (weatherData.weatherCondition === 'rainy') impactScore -= 0.1;
      if (weatherData.weatherCondition === 'sunny') impactScore += 0.1;
  }
  
  return Math.max(-1, Math.min(1, impactScore)); // Clamp between -1 and 1
};

export const fetchWeatherForecast = async (location: string): Promise<WeatherData> => {
  // Note: Replace with actual API key implementation
  const apiKey = 'YOUR_WEATHER_API_KEY';
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    
    return {
      temperature: data.current.temp_c,
      precipitation: data.current.precip_mm,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      weatherCondition: data.current.condition.text,
      alert: data.alerts?.alert[0]?.desc
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

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
  
  // Calculate price impact using elasticity
  const priceChange = (effectivePrice - basePrice) / basePrice;
  const demandChange = priceChange * elasticity;
  
  return baselineDemand * (1 + demandChange);
};

export const analyzePriceSensitivity = (
  historicalData: { price: number; demand: number }[]
): PriceAnalysis => {
  // Calculate average price and demand
  const avgPrice = historicalData.reduce((sum, d) => sum + d.price, 0) / historicalData.length;
  const avgDemand = historicalData.reduce((sum, d) => sum + d.demand, 0) / historicalData.length;
  
  // Calculate price elasticity using linear regression
  const numerator = historicalData.reduce((sum, d) => {
    return sum + ((d.demand - avgDemand) * (d.price - avgPrice));
  }, 0);
  
  const denominator = historicalData.reduce((sum, d) => {
    return sum + Math.pow(d.price - avgPrice, 2);
  }, 0);
  
  const elasticity = (numerator / denominator) * (avgPrice / avgDemand);
  
  // Find optimal price using historical data
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
