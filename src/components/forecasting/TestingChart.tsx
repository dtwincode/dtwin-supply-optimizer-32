
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { generateTestData } from "@/utils/forecasting/testDataGenerator";
import { type TestDataParams } from "@/utils/forecasting/testDataGenerator";
import { getModelExample } from "@/utils/forecasting/modelSelection";
import { defaultModelConfigs } from "@/types/modelParameters";

interface TestingChartProps {
  historicalData: any[];
  predictedData: any[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export const TestingChart = ({ 
  historicalData, 
  predictedData, 
  timeRange, 
  onTimeRangeChange 
}: TestingChartProps) => {
  const [selectedModel, setSelectedModel] = useState("moving-avg");
  const [modelExample, setModelExample] = useState(getModelExample("moving-avg", []));
  
  // Model-specific parameters based on the selected model
  const [modelParams, setModelParams] = useState({
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

  const getParamConfig = (modelId: string) => {
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

  const generateNewTestData = () => {
    const params = modelParams[selectedModel as keyof typeof modelParams];
    const modelSpecificData = generateTestData({
      length: 52,
      modelType: selectedModel,
      parameters: params
    });
    setModelExample(getModelExample(selectedModel, modelSpecificData || [])); // Added null check
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Model Testing Results</h3>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="60">Last 60 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="180">Last 180 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={selectedModel} 
            onValueChange={(value) => {
              setSelectedModel(value);
              setModelExample(getModelExample(value, []));
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {defaultModelConfigs.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={generateNewTestData}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Generate Test Data
          </Button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">{modelExample.description}</h4>
        <p className="text-sm text-muted-foreground mb-2">Best Use Case: {modelExample.bestUseCase}</p>
        <div className="text-sm text-muted-foreground">
          Recommended Parameters:
          {Object.entries(modelExample.recommendedParams).map(([key, value]) => (
            <span key={key} className="ml-2">
              {key}: {value}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {getParamConfig(selectedModel).map((param) => (
          <div key={param.key}>
            <label className="block text-sm font-medium mb-2">
              {param.name}
              <span className="block text-xs text-gray-500">{param.description}</span>
            </label>
            <input
              type="range"
              min={param.min}
              max={param.max}
              step={param.step}
              value={modelParams[selectedModel as keyof typeof modelParams][param.key as keyof typeof modelParams[keyof typeof modelParams]]}
              onChange={(e) => {
                setModelParams(prev => ({
                  ...prev,
                  [selectedModel]: {
                    ...prev[selectedModel as keyof typeof modelParams],
                    [param.key]: parseFloat(e.target.value)
                  }
                }));
              }}
              className="w-full"
            />
            <span className="text-sm text-gray-500">
              {modelParams[selectedModel as keyof typeof modelParams][param.key as keyof typeof modelParams[keyof typeof modelParams]]}
            </span>
          </div>
        ))}
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[]}> {/* This will be populated by generateTestData */}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10B981"
              name="Test Data"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
