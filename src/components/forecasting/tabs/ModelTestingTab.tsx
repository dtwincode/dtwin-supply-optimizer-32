
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TestingChart } from "@/components/forecasting/TestingChart";
import { useState } from "react";
import { useTestData } from "@/hooks/useTestData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  const [trainingTimePeriod, setTrainingTimePeriod] = useState<string>("");
  const [trainingRange, setTrainingRange] = useState<string>("");
  
  // Testing period states
  const [testingTimePeriod, setTestingTimePeriod] = useState<string>("");
  const [testingRange, setTestingRange] = useState<string>("");
  
  // Time period options
  const timePeriodOptions = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Yearly", value: "yearly" }
  ];

  // Range options
  const rangeOptions = [
    { label: "Last 4 weeks", value: "4w" },
    { label: "Last 3 months", value: "3m" },
    { label: "Last 6 months", value: "6m" },
    { label: "Last year", value: "1y" }
  ];

  const handleTrainingPeriodChange = (value: string) => {
    setTrainingTimePeriod(value);
    generateNewTestData('moving-avg', {}, value === '4w' ? '28' : value === '3m' ? '90' : value === '6m' ? '180' : '365');
  };

  const handleTrainingRangeChange = (value: string) => {
    setTrainingRange(value);
  };

  const handleTestingPeriodChange = (value: string) => {
    setTestingTimePeriod(value);
  };

  const handleTestingRangeChange = (value: string) => {
    setTestingRange(value);
  };

  return (
    <Card className="p-6 space-y-8">
      {/* Training Configuration */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Training Configuration</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Period</label>
            <Select value={trainingTimePeriod} onValueChange={handleTrainingPeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {timePeriodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Range</label>
            <Select value={trainingRange} onValueChange={handleTrainingRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {rangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Testing Configuration */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Testing Configuration</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Period</label>
            <Select value={testingTimePeriod} onValueChange={handleTestingPeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {timePeriodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Range</label>
            <Select value={testingRange} onValueChange={handleTestingRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {rangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <TestingChart
        historicalData={testData}
        predictedData={predictedData}
      />
    </Card>
  );
};
