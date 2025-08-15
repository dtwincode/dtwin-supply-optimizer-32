
import { ModelConfig } from './commonTypes';

export const seasonalModels: ModelConfig[] = [
  {
    id: "prophet",
    name: "Prophet",
    parameters: [
      {
        name: "changePointPrior",
        value: 0.05,
        min: 0.001,
        max: 0.5,
        step: 0.001,
        description: "Flexibility of the trend (0.001-0.5)"
      },
      {
        name: "seasonalityPrior",
        value: 10,
        min: 0.01,
        max: 50,
        step: 0.01,
        description: "Strength of the seasonality (0.01-50)"
      },
      {
        name: "holidaysPrior",
        value: 10,
        min: 0.01,
        max: 50,
        step: 0.01,
        description: "Strength of holidays effect (0.01-50)"
      },
      {
        name: "seasonalityMode",
        value: 1,
        min: 0,
        max: 1,
        step: 1,
        description: "Seasonality mode (0: additive, 1: multiplicative)"
      }
    ]
  },
  {
    id: "sarima",
    name: "Seasonal ARIMA (SARIMA)",
    parameters: [
      {
        name: "p",
        value: 1,
        min: 0,
        max: 5,
        step: 1,
        description: "Non-seasonal AR order"
      },
      {
        name: "d",
        value: 1,
        min: 0,
        max: 2,
        step: 1,
        description: "Non-seasonal differencing"
      },
      {
        name: "q",
        value: 1,
        min: 0,
        max: 5,
        step: 1,
        description: "Non-seasonal MA order"
      },
      {
        name: "P",
        value: 1,
        min: 0,
        max: 5,
        step: 1,
        description: "Seasonal AR order"
      },
      {
        name: "D",
        value: 1,
        min: 0,
        max: 2,
        step: 1,
        description: "Seasonal differencing"
      },
      {
        name: "Q",
        value: 1,
        min: 0,
        max: 5,
        step: 1,
        description: "Seasonal MA order"
      },
      {
        name: "m",
        value: 12,
        min: 1,
        max: 52,
        step: 1,
        description: "Number of periods in a season"
      }
    ]
  },
  {
    id: "tbats",
    name: "TBATS",
    parameters: [
      {
        name: "boxCox",
        value: 0,
        min: 0,
        max: 1,
        step: 1,
        description: "Box-Cox transformation (0: none, 1: auto)"
      },
      {
        name: "harmonics",
        value: 2,
        min: 1,
        max: 5,
        step: 1,
        description: "Number of harmonic terms"
      },
      {
        name: "seasonalPeriods",
        value: 12,
        min: 2,
        max: 52,
        step: 1,
        description: "Number of periods in seasonal pattern"
      }
    ]
  }
];
