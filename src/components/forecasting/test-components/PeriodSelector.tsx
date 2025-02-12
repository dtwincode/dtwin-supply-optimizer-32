
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PeriodSelectorProps {
  title: string;
  range: string;
  fromDate: Date;
  toDate: Date;
  onRangeChange: (value: string) => void;
  onDateChange: (type: 'from' | 'to', date: Date | undefined) => void;
  rangeOptions: { label: string; value: string; }[];
}

export const PeriodSelector = ({
  title,
  range,
  fromDate,
  toDate,
  onRangeChange,
  onDateChange,
  rangeOptions,
}: PeriodSelectorProps) => {
  console.log(`Rendering PeriodSelector for ${title}`, { range, fromDate, toDate });
  
  return (
    <div className="space-y-4">
      <Select value={range} onValueChange={onRangeChange}>
        <SelectTrigger className="w-full bg-white rounded-xl border-gray-200">
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {rangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-white rounded-xl border-gray-200",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => onDateChange('from', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-white rounded-xl border-gray-200",
                !toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => onDateChange('to', date)}
              initialFocus
              fromDate={fromDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
