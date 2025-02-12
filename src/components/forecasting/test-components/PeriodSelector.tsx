
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
        <SelectTrigger className="w-full h-14 px-6 bg-white hover:bg-gray-50 border-[1.5px] border-gray-100 rounded-2xl transition-colors shadow-sm">
          <SelectValue placeholder={title} className="text-gray-900 text-base font-medium" />
        </SelectTrigger>
        <SelectContent className="bg-white border-[1.5px] border-gray-100 rounded-2xl shadow-xl overflow-hidden mt-2">
          {rangeOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer py-3 px-6 text-base"
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
                "w-full h-14 justify-start text-left font-medium bg-white hover:bg-gray-50 border-[1.5px] border-gray-100 rounded-2xl transition-colors shadow-sm",
                !fromDate && "text-gray-500"
              )}
            >
              <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
              {fromDate ? format(fromDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white rounded-2xl border-[1.5px] border-gray-100 shadow-xl mt-2" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => onDateChange('from', date)}
              initialFocus
              className="rounded-2xl p-3"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-14 justify-start text-left font-medium bg-white hover:bg-gray-50 border-[1.5px] border-gray-100 rounded-2xl transition-colors shadow-sm",
                !toDate && "text-gray-500"
              )}
            >
              <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
              {toDate ? format(toDate, "MMM dd, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white rounded-2xl border-[1.5px] border-gray-100 shadow-xl mt-2" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => onDateChange('to', date)}
              initialFocus
              fromDate={fromDate}
              className="rounded-2xl p-3"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
