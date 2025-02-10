
import { ModelConfig } from './commonTypes';

export const basicModels: ModelConfig[] = [
  {
    id: "moving-avg",
    name: "Moving Average",
    parameters: [
      {
        name: "windowSize",
        value: 3,
        min: 2,
        max: 12,
        step: 1,
        description: "Number of periods to include in the moving average calculation"
      }
    ]
  },
  {
    id: "exp-smoothing",
    name: "Exponential Smoothing",
    parameters: [
      {
        name: "alpha",
        value: 0.3,
        min: 0,
        max: 1,
        step: 0.1,
        description: "Smoothing factor for level (α)"
      },
      {
        name: "beta",
        value: 0.1,
        min: 0,
        max: 1,
        step: 0.1,
        description: "Smoothing factor for trend (β)"
      },
      {
        name: "gamma",
        value: 0.1,
        min: 0,
        max: 1,
        step: 0.1,
        description: "Smoothing factor for seasonality (γ)"
      }
    ]
  },
  {
    id: "arima",
    name: "ARIMA",
    parameters: [
      {
        name: "p",
        value: 1,
        min: 0,
        max: 5,
        step: 1,
        description: "Number of autoregressive terms (p)"
      },
      {
        name: "d",
        value: 1,
        min: 0,
        max: 2,
        step: 1,
        description: "Number of differences (d)"
      },
      {
        name: "q",
        value: 1,
        min: 0,
        max: 5,
        step: 1,
        description: "Number of moving average terms (q)"
      }
    ]
  }
];
