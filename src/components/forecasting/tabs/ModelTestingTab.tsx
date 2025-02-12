
import { Card } from "@/components/ui/card";
import { TestingChart } from "@/components/forecasting/TestingChart";
import { useState } from "react";
import { useTestData } from "@/hooks/useTestData";
import { useToast } from "@/hooks/use-toast";
import { differenceInDays } from "date-fns";
import { PeriodSelector } from "../test-components/PeriodSelector";

interface ModelTestingTabProps {
  historicalData: any[];
  predictedData: any[];
  scenarioId?: string;
}

export const ModelTestingTab = ({
  historicalData,
  predictedData,
  scenarioId
}: ModelTestingTabProps) => {
  const { toast } = useToast();
  const { testData, generateNewTestData } = useTestData();

  // Training period states
  const [trainingRange, setTrainingRange] = useState<string>("custom");
  const [trainingFromDate, setTrainingFromDate] = useState<Date>(new Date('2024-01-01'));
  const [trainingToDate, setTrainingToDate] = useState<Date>(new Date('2024-06-30'));

  // Testing period states
  const [testingRange, setTestingRange] = useState<string>("custom");
  const [testingFromDate, setTestingFromDate] = useState<Date>(new Date('2024-07-01'));
  const [testingToDate, setTestingToDate] = useState<Date>(new Date('2024-12-31'));

  // Range options
  const rangeOptions = [
    { label: "Last Month", value: "1m" },
    { label: "Last 3 Months", value: "3m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last Year", value: "1y" },
    { label: "Custom", value: "custom" }
  ];

  const handleRangeChange = (periodType: 'training' | 'testing', value: string) => {
    const now = new Date();
    let start = new Date();
    
    switch (value) {
      case "1m":
        start.setMonth(now.getMonth() - 1);
        break;
      case "3m":
        start.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        start.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return;
    }
    
    if (periodType === 'training') {
      setTrainingRange(value);
      setTrainingFromDate(start);
      setTrainingToDate(now);
    } else {
      setTestingRange(value);
      setTestingFromDate(start);
      setTestingToDate(now);
    }
  };

  const handleDateChange = (
    periodType: 'training' | 'testing',
    type: 'from' | 'to',
    date: Date | undefined
  ) => {
    if (!date) return;
    
    if (periodType === 'training') {
      if (type === 'from') {
        setTrainingFromDate(date);
        setTrainingRange('custom');
      } else {
        setTrainingToDate(date);
        setTrainingRange('custom');
      }
    } else {
      if (type === 'from') {
        setTestingFromDate(date);
        setTestingRange('custom');
      } else {
        setTestingToDate(date);
        setTestingRange('custom');
      }
    }

    // Update test data based on the new date ranges
    const trainingDays = differenceInDays(trainingToDate, trainingFromDate);
    const testingDays = differenceInDays(testingToDate, testingFromDate);
    generateNewTestData('moving-avg', {}, `${trainingDays},${testingDays}`);
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PeriodSelector
          title="Training Period"
          range={trainingRange}
          fromDate={trainingFromDate}
          toDate={trainingToDate}
          onRangeChange={(value) => handleRangeChange('training', value)}
          onDateChange={(type, date) => handleDateChange('training', type, date)}
          rangeOptions={rangeOptions}
        />

        <PeriodSelector
          title="Testing Period"
          range={testingRange}
          fromDate={testingFromDate}
          toDate={testingToDate}
          onRangeChange={(value) => handleRangeChange('testing', value)}
          onDateChange={(type, date) => handleDateChange('testing', type, date)}
          rangeOptions={rangeOptions}
        />
      </div>

      <div className="mt-8">
        <TestingChart
          historicalData={testData}
          predictedData={predictedData}
        />
      </div>
    </Card>
  );
};
