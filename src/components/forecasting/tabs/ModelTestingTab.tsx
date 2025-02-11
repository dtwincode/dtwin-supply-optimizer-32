
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

  // Add console log to check testData
  useEffect(() => {
    console.log('ModelTestingTab - Initial testData:', testData);
  }, [testData]);

  // Generate initial test data
  useEffect(() => {
    console.log('ModelTestingTab - Generating initial data');
    generateNewTestData('moving-avg', {}, '30');
  }, []);

  return (
    <TestingChart
      historicalData={testData}
      predictedData={predictedData}
    />
  );
};
