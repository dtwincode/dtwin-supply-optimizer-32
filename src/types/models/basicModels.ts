
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
    id: "weighted-ma",
    name: "Weighted Moving Average",
    parameters: [
      {
        name: "windowSize",
        value: 3,
        min: 2,
        max: 12,
        step: 1,
        description: "Number of periods to include in the weighted moving average"
      },
      {
        name: "decayFactor",
        value: 0.2,
        min: 0.1,
        max: 0.9,
        step: 0.1,
        description: "Weight decay factor for older observations"
      }
    ]
  },
  {
    id: "single-exp",
    name: "Single Exponential Smoothing",
    parameters: [
      {
        name: "alpha",
        value: 0.3,
        min: 0,
        max: 1,
        step: 0.1,
        description: "Smoothing factor (α) for level"
      }
    ]
  },
  {
    id: "double-exp",
    name: "Double Exponential Smoothing",
    parameters: [
      {
        name: "alpha",
        value: 0.3,
        min: 0,
        max: 1,
        step: 0.1,
        description: "Smoothing factor (α) for level"
      },
      {
        name: "beta",
        value: 0.1,
        min: 0,
        max: 1,
        step: 0.1,
        description: "Smoothing factor (β) for trend"
      }
    ]
  },
  {
    id: "triple-exp",
    name: "Triple Exponential Smoothing",
    parameters: [
      {
        name: "alpha",
        value: 0.3,
        min: 0,
        max: 1,
        step: 0.1,
        description: "Smoothing factor (α) for level"
      },
      {
        name: "beta",
        value: 0.1,
        min: 0,
        max: 1,
        step: 0.1,
        description: "Smoothing factor (β) for trend"
      },
      {
        name: "gamma",
        value: 0.1,
        min: 0,
        max: 1,
        step: 0.1,
        description: "Smoothing factor (γ) for seasonality"
      },
      {
        name: "seasonalPeriods",
        value: 12,
        min: 2,
        max: 52,
        step: 1,
        description: "Number of periods in a seasonal cycle"
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
