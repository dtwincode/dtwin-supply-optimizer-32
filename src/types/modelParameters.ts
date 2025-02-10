
export interface ModelParameter {
  name: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  description: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  parameters: ModelParameter[];
}

export const defaultModelConfigs: ModelConfig[] = [
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
  },
  {
    id: "ml-lstm",
    name: "Machine Learning (LSTM)",
    parameters: [
      {
        name: "epochs",
        value: 100,
        min: 10,
        max: 1000,
        step: 10,
        description: "Number of training epochs"
      },
      {
        name: "layers",
        value: 2,
        min: 1,
        max: 5,
        step: 1,
        description: "Number of LSTM layers"
      },
      {
        name: "neurons",
        value: 50,
        min: 10,
        max: 200,
        step: 10,
        description: "Neurons per layer"
      }
    ]
  }
];
