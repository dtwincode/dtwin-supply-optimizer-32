
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DateRangeSelector } from "./date-range/DateRangeSelector";
import { PeriodSelector, TimePeriod } from "./date-range/PeriodSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectionType, setSelectionType] = useState<"date" | "period">("period");
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          value={selectionType}
          onValueChange={(value: "date" | "period") => setSelectionType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="period">Time Period</SelectItem>
            <SelectItem value="date">Date Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-2">
        {selectionType === "date" ? (
          <DateRangeSelector
            fromDate={fromDate}
            toDate={toDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        ) : (
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            periodCount={periodCount}
            onPeriodChange={handlePeriodChange}
            onPeriodCountChange={(count) => {
              setPeriodCount(count);
              handlePeriodChange(selectedPeriod);
            }}
          />
        )}
      </div>
    </div>
  );
};
