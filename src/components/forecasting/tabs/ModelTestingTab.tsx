
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
  const [selectedTrainingRange, setSelectedTrainingRange] = useState<string>("");
  const [selectedTestingRange, setSelectedTestingRange] = useState<string>("");
  
  // Predefined date ranges
  const dateRanges = [
    { label: "Last 3 months", value: "3m" },
    { label: "Last 6 months", value: "6m" },
    { label: "Last year", value: "1y" },
    { label: "Custom", value: "custom" }
  ];

  const handleTrainingRangeChange = (value: string) => {
    setSelectedTrainingRange(value);
    generateNewTestData('moving-avg', {}, value === '3m' ? '90' : value === '6m' ? '180' : '365');
  };

  const handleTestingRangeChange = (value: string) => {
    setSelectedTestingRange(value);
    // Additional logic for testing period if needed
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Training Period Selection */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Training Period</h3>
          <div className="flex items-center space-x-4">
            <Select value={selectedTrainingRange} onValueChange={handleTrainingRangeChange}>
              <SelectTrigger className="w-[200px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Training Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTrainingRange === 'custom' && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Jan 01, 2024</span>
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Dec 26, 2024</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Testing Period Selection */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Testing Period</h3>
          <div className="flex items-center space-x-4">
            <Select value={selectedTestingRange} onValueChange={handleTestingRangeChange}>
              <SelectTrigger className="w-[200px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Testing Range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTestingRange === 'custom' && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Jan 01, 2024</span>
                </div>
                <span className="text-muted-foreground">to</span>
                <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-md">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Dec 26, 2024</span>
                </div>
              </div>
            )}
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
