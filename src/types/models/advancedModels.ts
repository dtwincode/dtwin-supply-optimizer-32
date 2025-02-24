
import { ModelConfig } from './commonTypes';

export const advancedModels: ModelConfig[] = [
  {
    id: "neural-prophet",
    name: "Neural Prophet",
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
        name: "learningRate",
        value: 0.001,
        min: 0.0001,
        max: 0.1,
        step: 0.0001,
        description: "Learning rate for training"
      }
    ]
  },
  {
    id: "xgboost",
    name: "XGBoost",
    parameters: [
      {
        name: "maxDepth",
        value: 6,
        min: 3,
        max: 10,
        step: 1,
        description: "Maximum tree depth"
      },
      {
        name: "learningRate",
        value: 0.1,
        min: 0.01,
        max: 0.3,
        step: 0.01,
        description: "Learning rate"
      }
    ]
  }
];
