
import { useState } from "react";

type ModelParams = {
  "moving-avg": {
    windowSize: number;
  };
  "exp-smoothing": {
    alpha: number;
    beta: number;
    gamma: number;
  };
  "arima": {
    p: number;
    d: number;
    q: number;
  };
  "prophet": {
    changePointPrior: number;
    seasonalityPrior: number;
  };
};

export const useModelParameters = () => {
  const [modelParams, setModelParams] = useState<ModelParams>({
    "moving-avg": {
      windowSize: 3,
    },
    "exp-smoothing": {
      alpha: 0.3,
      beta: 0.1,
      gamma: 0.1
    },
    "arima": {
      p: 1,
      d: 1,
      q: 1
    },
    "prophet": {
      changePointPrior: 0.05,
      seasonalityPrior: 10,
    }
  });

  const handleParameterChange = (modelId: keyof ModelParams, key: string, value: number) => {
    setModelParams(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        [key]: value
      }
    }));
  };

  return {
    modelParams,
    handleParameterChange
  };
};

