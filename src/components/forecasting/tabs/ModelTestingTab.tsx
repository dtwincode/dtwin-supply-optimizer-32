
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
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

  // Date range states
  const [selectedRange, setSelectedRange] = useState<string>("custom");
  const [fromDate, setFromDate] = useState<Date>(new Date('2024-01-01'));
  const [toDate, setToDate] = useState<Date>(new Date('2024-12-26'));

  // Range options
  const rangeOptions = [
    { label: "Last Month", value: "1m" },
    { label: "Last 3 Months", value: "3m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last Year", value: "1y" },
    { label: "Custom", value: "custom" }
  ];

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
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
    
    setFromDate(start);
    setToDate(now);
  };

  const handleDateChange = (type: 'from' | 'to', date: Date | undefined) => {
    if (!date) return;
    
    if (type === 'from') {
      setFromDate(date);
      setSelectedRange('custom');
    } else {
      setToDate(date);
      setSelectedRange('custom');
    }

    const days = differenceInDays(toDate, fromDate);
    generateNewTestData('moving-avg', {}, days.toString());
  };

  return (
    <Card className="p-6 space-y-8">
      <div className="space-y-6">
        <div className="space-y-4">
          {/* Date Range Selector */}
          <div className="w-full">
            <Select value={selectedRange} onValueChange={handleRangeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Date Range" />
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

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => handleDateChange('from', date)}
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
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => handleDateChange('to', date)}
                    initialFocus
                    fromDate={fromDate}
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
