
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
  fromDate: Date | null;
  toDate: Date | null;
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
  
  const handleRangeSelection = (newValue: string) => {
    console.log('Handling range selection:', newValue);
    onRangeChange(newValue);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <Select value={range} onValueChange={handleRangeSelection}>
        <SelectTrigger className="w-full h-16 px-8 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {rangeOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="cursor-pointer py-2"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-16 justify-start text-left font-normal bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-4 h-5 w-5" />
              {fromDate ? format(fromDate, "MMM dd, yyyy") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <Calendar
              mode="single"
              selected={fromDate || undefined}
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
                "w-full h-16 justify-start text-left font-normal bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200",
                !toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-4 h-5 w-5" />
              {toDate ? format(toDate, "MMM dd, yyyy") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <Calendar
              mode="single"
              selected={toDate || undefined}
              onSelect={(date) => onDateChange('to', date)}
              initialFocus
              fromDate={fromDate || undefined}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
