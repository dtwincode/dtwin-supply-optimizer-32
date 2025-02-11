
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
import { differenceInDays } from "date-fns";

interface TestingChartProps {
  historicalData: any[];
  predictedData: any[];
}

export const TestingChart = ({ 
  historicalData, 
  predictedData
}: TestingChartProps) => {
  const [selectedModel, setSelectedModel] = useState("moving-avg");
  const [modelExample, setModelExample] = useState(getModelExample("moving-avg", []));
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)));
  
  const { modelParams, handleParameterChange } = useModelParameters();
  const { getParamConfig } = useParamConfig();
  const { testData, generateNewTestData } = useTestData();

  const handleDateRangeChange = (from: Date, to: Date) => {
    setFromDate(from);
    setToDate(to);
  };

  const generateNewData = () => {
    const params = modelParams[selectedModel as keyof typeof modelParams];
    const days = differenceInDays(toDate, fromDate);
    const modelSpecificData = generateNewTestData(selectedModel, params, days.toString());
    setModelExample(getModelExample(selectedModel, modelSpecificData || []));
  };

  const handleParamChange = (key: string, value: number) => {
    handleParameterChange(selectedModel as keyof typeof modelParams, key, value);
  };

  // Format historical data for the chart
  const chartData = historicalData.map(item => ({
    date: item.date,
    actual: item.actual
  }));

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Model Testing Results</h3>
        <ChartControls
          fromDate={fromDate}
          toDate={toDate}
          onDateRangeChange={handleDateRangeChange}
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

      <TestDataChart data={chartData} />
    </Card>
  );
};
