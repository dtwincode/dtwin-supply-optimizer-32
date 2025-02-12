
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
  
  return (
    <div className="space-y-6">
      <Select value={range} onValueChange={onRangeChange}>
        <SelectTrigger className="w-full h-16 px-8 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-3xl transition-all duration-200 shadow-lg">
          <SelectValue placeholder="Select a date range" className="text-blue-900 text-lg font-semibold" />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-blue-200 rounded-3xl shadow-2xl overflow-hidden mt-2 p-2">
          {rangeOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer py-4 px-8 text-lg rounded-xl my-1"
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
                "w-full h-16 justify-start text-left font-semibold bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-3xl transition-all duration-200 shadow-lg",
                !fromDate && "text-blue-400"
              )}
            >
              <CalendarIcon className="mr-4 h-6 w-6 text-blue-500" />
              {fromDate ? format(fromDate, "MMM dd, yyyy") : "Select start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 bg-white rounded-3xl border-2 border-blue-200 shadow-2xl mt-2" align="start">
            <Calendar
              mode="single"
              selected={fromDate || undefined}
              onSelect={(date) => onDateChange('from', date)}
              initialFocus
              className="rounded-2xl"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-16 justify-start text-left font-semibold bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-3xl transition-all duration-200 shadow-lg",
                !toDate && "text-blue-400"
              )}
            >
              <CalendarIcon className="mr-4 h-6 w-6 text-blue-500" />
              {toDate ? format(toDate, "MMM dd, yyyy") : "Select end date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 bg-white rounded-3xl border-2 border-blue-200 shadow-2xl mt-2" align="start">
            <Calendar
              mode="single"
              selected={toDate || undefined}
              onSelect={(date) => onDateChange('to', date)}
              initialFocus
              fromDate={fromDate || undefined}
              className="rounded-2xl"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
