
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
        <SelectTrigger className="w-full h-12 px-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
          <SelectValue placeholder={title} className="text-gray-600" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
          {rangeOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer py-2.5"
            >
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
                "w-full h-12 justify-start text-left font-normal bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors",
                !fromDate && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {fromDate ? format(fromDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white rounded-lg border border-gray-200 shadow-lg" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => onDateChange('from', date)}
              initialFocus
              className="rounded-lg"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 justify-start text-left font-normal bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors",
                !toDate && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {toDate ? format(toDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white rounded-lg border border-gray-200 shadow-lg" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => onDateChange('to', date)}
              initialFocus
              fromDate={fromDate}
              className="rounded-lg"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
