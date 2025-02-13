
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

  const [trainingRange, setTrainingRange] = useState<string>("");
  const [trainingFromDate, setTrainingFromDate] = useState<Date | null>(null);
  const [trainingToDate, setTrainingToDate] = useState<Date | null>(null);

  const [testingRange, setTestingRange] = useState<string>("");
  const [testingFromDate, setTestingFromDate] = useState<Date | null>(null);
  const [testingToDate, setTestingToDate] = useState<Date | null>(null);

  const rangeOptions = [
    { label: "Select period", value: "" },
    { label: "Last Month", value: "1m" },
    { label: "Last 3 Months", value: "3m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last Year", value: "1y" },
    { label: "Custom", value: "custom" }
  ];

  const handleRangeChange = (periodType: 'training' | 'testing', value: string) => {
    const now = new Date();
    let start = new Date();
    
    if (value === "") {
      if (periodType === 'training') {
        setTrainingRange("");
        setTrainingFromDate(null);
        setTrainingToDate(null);
        toast({
          title: "Training period reset",
          description: "Please select a new training period",
        });
      } else {
        setTestingRange("");
        setTestingFromDate(null);
        setTestingToDate(null);
        toast({
          title: "Testing period reset",
          description: "Please select a new testing period",
        });
      }
      return;
    }
    
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
      case "custom":
        if (periodType === 'training') {
          setTrainingFromDate(null);
          setTrainingToDate(null);
          toast({
            title: "Custom training period selected",
            description: "Please select your training date range",
          });
        } else {
          setTestingFromDate(null);
          setTestingToDate(null);
          toast({
            title: "Custom testing period selected",
            description: "Please select your testing date range",
          });
        }
        break;
      default:
        return;
    }
    
    if (periodType === 'training') {
      setTrainingRange(value);
      if (value !== 'custom') {
        setTrainingFromDate(start);
        setTrainingToDate(now);
        toast({
          title: "Training period updated",
          description: `Set to: ${value === "1m" ? "Last Month" : 
                                value === "3m" ? "Last 3 Months" : 
                                value === "6m" ? "Last 6 Months" : "Last Year"}`,
        });
      }
    } else {
      setTestingRange(value);
      if (value !== 'custom') {
        setTestingFromDate(start);
        setTestingToDate(now);
        toast({
          title: "Testing period updated",
          description: `Set to: ${value === "1m" ? "Last Month" : 
                                value === "3m" ? "Last 3 Months" : 
                                value === "6m" ? "Last 6 Months" : "Last Year"}`,
        });
      }
    }

    if (trainingFromDate && trainingToDate && testingFromDate && testingToDate) {
      const trainingDays = differenceInDays(trainingToDate, trainingFromDate);
      const testingDays = differenceInDays(testingToDate, testingFromDate);
      generateNewTestData('moving-avg', {}, `${trainingDays},${testingDays}`);
      toast({
        title: "Data updated",
        description: "Test data has been regenerated with new periods",
      });
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
        toast({
          title: "Training start date set",
          description: "Please select an end date if not already selected",
        });
      } else {
        setTrainingToDate(date);
        setTrainingRange('custom');
        toast({
          title: "Training end date set",
          description: "Training period has been updated",
        });
      }
    } else {
      if (type === 'from') {
        setTestingFromDate(date);
        setTestingRange('custom');
        toast({
          title: "Testing start date set",
          description: "Please select an end date if not already selected",
        });
      } else {
        setTestingToDate(date);
        setTestingRange('custom');
        toast({
          title: "Testing end date set",
          description: "Testing period has been updated",
        });
      }
    }

    if (trainingFromDate && trainingToDate && testingFromDate && testingToDate) {
      const trainingDays = differenceInDays(trainingToDate, trainingFromDate);
      const testingDays = differenceInDays(testingToDate, testingFromDate);
      generateNewTestData('moving-avg', {}, `${trainingDays},${testingDays}`);
      toast({
        title: "Data updated",
        description: "Test data has been regenerated with new dates",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ minHeight: '400px' }}>
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
