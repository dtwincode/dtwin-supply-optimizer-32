
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TestingChart } from "@/components/forecasting/TestingChart";
import { useState } from "react";
import { useTestData } from "@/hooks/useTestData";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";

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
    <Card className="p-6 space-y-8">
      {/* Training Period */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Training Period</h3>
        <div className="space-y-4">
          <div className="w-full">
            <Select value={trainingRange} onValueChange={(value) => handleRangeChange('training', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Training Period Range" />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !trainingFromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {trainingFromDate ? format(trainingFromDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={trainingFromDate}
                    onSelect={(date) => handleDateChange('training', 'from', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !trainingToDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {trainingToDate ? format(trainingToDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={trainingToDate}
                    onSelect={(date) => handleDateChange('training', 'to', date)}
                    initialFocus
                    fromDate={trainingFromDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Testing Period */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Testing Period</h3>
        <div className="space-y-4">
          <div className="w-full">
            <Select value={testingRange} onValueChange={(value) => handleRangeChange('testing', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Testing Period Range" />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !testingFromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {testingFromDate ? format(testingFromDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={testingFromDate}
                    onSelect={(date) => handleDateChange('testing', 'from', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !testingToDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {testingToDate ? format(testingToDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={testingToDate}
                    onSelect={(date) => handleDateChange('testing', 'to', date)}
                    initialFocus
                    fromDate={testingFromDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
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
