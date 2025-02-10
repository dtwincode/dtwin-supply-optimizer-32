
type Parameter = {
  name: string;
  key: string;
  min: number;
  max: number;
  step: number;
  description: string;
};

export const useParamConfig = () => {
  const getParamConfig = (modelId: string): Parameter[] => {
    switch(modelId) {
      case "moving-avg":
        return [
          {
            name: "Window Size",
            key: "windowSize",
            min: 2,
            max: 12,
            step: 1,
            description: "Number of periods to include in moving average"
          }
        ];
      case "exp-smoothing":
        return [
          {
            name: "Level (α)",
            key: "alpha",
            min: 0,
            max: 1,
            step: 0.1,
            description: "Weight given to recent observations"
          },
          {
            name: "Trend (β)",
            key: "beta",
            min: 0,
            max: 1,
            step: 0.1,
            description: "Weight given to trend component"
          },
          {
            name: "Seasonality (γ)",
            key: "gamma",
            min: 0,
            max: 1,
            step: 0.1,
            description: "Weight given to seasonal component"
          }
        ];
      case "arima":
        return [
          {
            name: "AR Order (p)",
            key: "p",
            min: 0,
            max: 5,
            step: 1,
            description: "Number of autoregressive terms"
          },
          {
            name: "Differencing (d)",
            key: "d",
            min: 0,
            max: 2,
            step: 1,
            description: "Number of differences needed for stationarity"
          },
          {
            name: "MA Order (q)",
            key: "q",
            min: 0,
            max: 5,
            step: 1,
            description: "Number of moving average terms"
          }
        ];
      case "prophet":
        return [
          {
            name: "Change Point Prior",
            key: "changePointPrior",
            min: 0.001,
            max: 0.5,
            step: 0.001,
            description: "Flexibility of the trend"
          },
          {
            name: "Seasonality Prior",
            key: "seasonalityPrior",
            min: 0.01,
            max: 50,
            step: 0.01,
            description: "Strength of seasonal pattern"
          }
        ];
      default:
        return [];
    }
  };

  return { getParamConfig };
};

