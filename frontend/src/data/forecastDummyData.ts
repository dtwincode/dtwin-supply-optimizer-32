
import { ForecastDataPoint } from "@/types/forecasting";

export const dummyData = {
  filteredData: [{
    id: "1",
    week: "2024-01-01",
    actual: 100,
    forecast: 105,
    variance: 5,
    region: "North",
    city: "Example City",
    channel: "Retail",
    warehouse: "Main",
    category: "Electronics",
    subcategory: "Phones",
    sku: "SKU123",
    l1_main_prod: "Electronics",
    l2_prod_line: "Mobile Devices",
    l3_prod_category: "Smartphones",
    l4_device_make: "Example Brand",
    l5_prod_sub_category: "Flagship",
    l6_device_model: "Model X",
    l7_device_color: "Black",
    l8_device_storage: "128GB"
  }] as ForecastDataPoint[],
  confidenceIntervals: [
    { upper: 110, lower: 90 }
  ],
  decomposition: {
    trend: [100, 105, 110],
    seasonal: [5, -5, 0]
  },
  validationResults: {
    biasTest: true,
    residualNormality: true,
    heteroskedasticityTest: true
  },
  crossValidationResults: {
    trainMetrics: { mape: 5, mae: 3, rmse: 4 },
    testMetrics: { mape: 6, mae: 4, rmse: 5 },
    validationMetrics: { mape: 5.5, mae: 3.5, rmse: 4.5 }
  },
  forecastTableData: [{
    date: "2024-01-01",
    value: 100,
    forecast: 105,
    sku: "SKU123",
    category: "Electronics",
    subcategory: "Phones",
    variance: 5,
    id: "1"
  }],
  weatherLocation: "New York",
  setWeatherLocation: (location: string) => {},
  weatherData: {
    temperature: 20,
    precipitation: 0,
    humidity: 65,
    windSpeed: 10,
    weatherCondition: "Clear"
  },
  fetchWeatherForecast: async (location: string) => ({
    temperature: 20,
    precipitation: 0,
    humidity: 65,
    windSpeed: 10,
    weatherCondition: "Clear"
  }),
  marketEvents: [],
  setMarketEvents: () => {},
  newEvent: {},
  setNewEvent: () => {},
  priceAnalysis: {
    priceElasticity: -1.2,
    optimalPrice: 99.99,
    priceThresholds: {
      min: 89.99,
      max: 109.99,
      optimal: 99.99
    }
  },
  historicalPriceData: [],
  addHistoricalPricePoint: () => {},
  calculatePriceAnalysis: () => {},
  whatIfScenario: []
};
