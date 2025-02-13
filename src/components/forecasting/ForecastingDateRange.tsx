
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
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

interface ForecastingDateRangeProps {
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
}

type TimePeriod = "weekly" | "monthly" | "quarterly" | "yearly";

export const ForecastingDateRange = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: ForecastingDateRangeProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handlePeriodCountChange = (count: string) => {
    setPeriodCount(count);
    handlePeriodChange(selectedPeriod);
  };

  const selectedDateRange = fromDate && toDate ? (
    `${format(fromDate, "MMM dd, yyyy")} - ${format(toDate, "MMM dd, yyyy")}`
  ) : "Select date range";

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal border-dashed",
              !fromDate && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{selectedDateRange}</span>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 opacity-50" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-4" align="start">
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
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "MMM dd, yyyy") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => date && setFromDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "MMM dd, yyyy") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={(date) => {
                        if (date) {
                          setToDate(date);
                          setIsOpen(false);
                        }
                      }}
                      initialFocus
                      fromDate={fromDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : selectionType === "period" ? (
              <div className="flex gap-2">
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={periodCount} 
                  onValueChange={(value) => {
                    handlePeriodCountChange(value);
                    setIsOpen(false);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 6, 8, 12, 24, 36].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Last {num} {selectedPeriod === "weekly" ? "weeks" : 
                                 selectedPeriod === "monthly" ? "months" :
                                 selectedPeriod === "quarterly" ? "quarters" : "years"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
