
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DateRangeSelector } from "./date-range/DateRangeSelector";
import { PeriodSelector, TimePeriod } from "./date-range/PeriodSelector";

interface ForecastingDateRangeProps {
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
}

export const ForecastingDateRange = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: ForecastingDateRangeProps) => {
  const [open, setOpen] = useState(false);
  const [selectionType, setSelectionType] = useState<"date" | "period" | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("weekly");
  const [periodCount, setPeriodCount] = useState<string>("4");

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    const today = new Date();
    let newFromDate = new Date(today);
    let newToDate = new Date(today);

    switch (period) {
      case "weekly":
        newFromDate.setDate(today.getDate() - (parseInt(periodCount) * 7));
        break;
      case "monthly":
        newFromDate.setMonth(today.getMonth() - parseInt(periodCount));
        break;
      case "quarterly":
        newFromDate.setMonth(today.getMonth() - (parseInt(periodCount) * 3));
        break;
      case "yearly":
        newFromDate.setFullYear(today.getFullYear() - parseInt(periodCount));
        break;
    }

    setFromDate(newFromDate);
    setToDate(newToDate);
  };

  const selectedDateRange = fromDate && toDate ? (
    `${format(fromDate, "MMM dd, yyyy")} - ${format(toDate, "MMM dd, yyyy")}`
  ) : "Select date range";

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className={cn(
            "flex-1 justify-start text-left font-normal border-dashed",
            !fromDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          {selectedDateRange}
        </Button>
        
        <div className="relative">
          <div 
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 p-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {open && (
              <div 
                className="absolute right-0 mt-2 z-50 bg-popover text-popover-foreground rounded-md border shadow-md"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <div className="w-[400px] p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Select Time Range</h3>
                      <Select
                        value={selectionType || undefined}
                        onValueChange={(value: "date" | "period") => setSelectionType(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose range type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date Range</SelectItem>
                          <SelectItem value="period">Time Period</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectionType === "date" ? (
                      <DateRangeSelector
                        fromDate={fromDate}
                        toDate={toDate}
                        setFromDate={setFromDate}
                        setToDate={setToDate}
                      />
                    ) : selectionType === "period" ? (
                      <PeriodSelector
                        selectedPeriod={selectedPeriod}
                        periodCount={periodCount}
                        onPeriodChange={handlePeriodChange}
                        onPeriodCountChange={(count) => {
                          setPeriodCount(count);
                          handlePeriodChange(selectedPeriod);
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
