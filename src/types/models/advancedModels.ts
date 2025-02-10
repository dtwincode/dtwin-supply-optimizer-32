
import { ModelConfig } from './commonTypes';

export const advancedModels: ModelConfig[] = [
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
  }
];
