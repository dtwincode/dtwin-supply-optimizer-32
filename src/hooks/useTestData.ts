
import { useState } from "react";
import { generateTestData } from "@/utils/forecasting/testDataGenerator";
import { format, eachDayOfInterval } from "date-fns";

export const useTestData = () => {
  const [testData, setTestData] = useState<{ date: string; actual: number }[]>([]);

  const generateNewTestData = (selectedModel: string, params: Record<string, number>, timeRange: string = "30") => {
    const days = parseInt(timeRange);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days);

    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    const modelSpecificData = generateTestData({
      length: days,
      modelType: selectedModel,
      parameters: params
    });

    const formattedData = modelSpecificData.map((value, index) => ({
      date: format(dates[index], "MMM dd, yyyy"),
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
