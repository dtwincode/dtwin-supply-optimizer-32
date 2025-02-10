
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
  },
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
      },
      {
        name: "growthCeiling",
        value: 1000,
        min: 100,
        max: 10000,
        step: 100,
        description: "Maximum capacity for logistic growth"
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
    id: "nnet",
    name: "Neural Network",
    parameters: [
      {
        name: "hiddenLayers",
        value: 1,
        min: 1,
        max: 5,
        step: 1,
        description: "Number of hidden layers"
      },
      {
        name: "neurons",
        value: 10,
        min: 5,
        max: 100,
        step: 5,
        description: "Neurons per hidden layer"
      },
      {
        name: "epochs",
        value: 100,
        min: 10,
        max: 1000,
        step: 10,
        description: "Training epochs"
      },
      {
        name: "learningRate",
        value: 0.01,
        min: 0.001,
        max: 0.1,
        step: 0.001,
        description: "Learning rate for training"
      }
    ]
  },
  {
    id: "var",
    name: "Vector Autoregression (VAR)",
    parameters: [
      {
        name: "p",
        value: 1,
        min: 1,
        max: 10,
        step: 1,
        description: "Order of VAR model"
      },
      {
        name: "deterministic",
        value: 1,
        min: 0,
        max: 2,
        step: 1,
        description: "Deterministic terms (0: none, 1: constant, 2: trend)"
      }
    ]
  },
  {
    id: "state-space",
    name: "State Space Models",
    parameters: [
      {
        name: "components",
        value: 3,
        min: 1,
        max: 5,
        step: 1,
        description: "Number of state components"
      },
      {
        name: "filterType",
        value: 0,
        min: 0,
        max: 1,
        step: 1,
        description: "Filter type (0: Kalman, 1: Extended Kalman)"
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
      }
    ]
  }
];
