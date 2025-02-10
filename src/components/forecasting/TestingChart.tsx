
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { getModelExample } from "@/utils/forecasting/modelSelection";
import { ChartControls } from "./test-chart/ChartControls";
import { ModelInfo } from "./test-chart/ModelInfo";
import { ParametersPanel } from "./test-chart/ParametersPanel";
import { TestDataChart } from "./test-chart/TestDataChart";
import { useModelParameters } from "@/hooks/useModelParameters";
import { useParamConfig } from "@/hooks/useParamConfig";
import { useTestData } from "@/hooks/useTestData";

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
  
  const { modelParams, handleParameterChange } = useModelParameters();
  const { getParamConfig } = useParamConfig();
  const { testData, generateNewTestData } = useTestData();

  const generateNewData = () => {
    const params = modelParams[selectedModel as keyof typeof modelParams];
    const modelSpecificData = generateNewTestData(selectedModel, params, timeRange);
    setModelExample(getModelExample(selectedModel, modelSpecificData || []));
  };

  const handleParamChange = (key: string, value: number) => {
    handleParameterChange(selectedModel as keyof typeof modelParams, key, value);
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
          onGenerateData={generateNewData}
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
        onChange={handleParamChange}
      />

      <TestDataChart data={testData} />
    </Card>
  );
};
