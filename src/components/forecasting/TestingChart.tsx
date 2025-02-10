
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { generateTestData } from "@/utils/forecasting/testDataGenerator";
import { type TestDataParams } from "@/utils/forecasting/testDataGenerator";
import { getModelExample } from "@/utils/forecasting/modelSelection";
import { ChartControls } from "./test-chart/ChartControls";
import { ModelInfo } from "./test-chart/ModelInfo";
import { ParametersPanel } from "./test-chart/ParametersPanel";
import { TestDataChart } from "./test-chart/TestDataChart";

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
  const [testData, setTestData] = useState<{ date: string; actual: number }[]>([]);
  
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

    // Transform the generated data into the format expected by the chart
    const formattedData = modelSpecificData.map((value, index) => ({
      date: `Week ${index + 1}`,
      actual: value
    }));

    setTestData(formattedData);
    setModelExample(getModelExample(selectedModel, modelSpecificData || []));
  };

  const handleParameterChange = (key: string, value: number) => {
    setModelParams(prev => ({
      ...prev,
      [selectedModel]: {
        ...prev[selectedModel as keyof typeof modelParams],
        [key]: value
      }
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Model Testing Results</h3>
        <ChartControls
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
          selectedModel={selectedModel}
          onModelChange={(value) => {
            setSelectedModel(value);
            setModelExample(getModelExample(value, []));
          }}
          onGenerateData={generateNewTestData}
        />
      </div>

      <ModelInfo
        description={modelExample.description}
        bestUseCase={modelExample.bestUseCase}
        recommendedParams={modelExample.recommendedParams}
      />

      <ParametersPanel
        parameters={getParamConfig(selectedModel)}
        values={modelParams[selectedModel as keyof typeof modelParams]}
        onChange={handleParameterChange}
      />

      <TestDataChart data={testData} />
    </Card>
  );
};
