
import { TestingChart } from "@/components/forecasting/TestingChart";
import { useState, useEffect } from "react";
import { useTestData } from "@/hooks/useTestData";

interface ModelTestingTabProps {
  historicalData: any[];
  predictedData: any[];
}

export const ModelTestingTab = ({
  historicalData,
  predictedData
}: ModelTestingTabProps) => {
  const { testData, generateNewTestData } = useTestData();

  // Generate initial test data
  useEffect(() => {
    generateNewTestData('moving-avg', {}, '30');
  }, [generateNewTestData]);

  return (
    <TestingChart
      historicalData={testData}
      predictedData={predictedData}
    />
  );
};
