
import { useState } from "react";
import { generateTestData } from "@/utils/forecasting/testDataGenerator";

export const useTestData = () => {
  const [testData, setTestData] = useState<{ date: string; actual: number }[]>([]);

  const generateNewTestData = (selectedModel: string, params: Record<string, number>) => {
    const modelSpecificData = generateTestData({
      length: 52,
      modelType: selectedModel,
      parameters: params
    });

    const formattedData = modelSpecificData.map((value, index) => ({
      date: `Week ${index + 1}`,
      actual: value
    }));

    setTestData(formattedData);
    return modelSpecificData;
  };

  return {
    testData,
    generateNewTestData
  };
};

