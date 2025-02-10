
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wand2, Calendar as CalendarIcon } from "lucide-react";
import { defaultModelConfigs } from "@/types/modelParameters";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

interface ChartControlsProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onGenerateData: () => void;
}

export const ChartControls = ({
  timeRange,
  onTimeRangeChange,
  selectedModel,
  onModelChange,
  onGenerateData
}: ChartControlsProps) => {
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)));

  const updateDateRange = (from: Date | undefined, to: Date | undefined) => {
    if (from && to) {
      const days = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
      onTimeRangeChange(days.toString());
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !fromDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "LLL dd, y") : "From Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                if (date) {
                  setFromDate(date);
                  updateDateRange(date, toDate);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !toDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "LLL dd, y") : "To Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => {
                if (date) {
                  setToDate(date);
                  updateDateRange(fromDate, date);
                }
              }}
              initialFocus
              fromDate={fromDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {defaultModelConfigs.map(model => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        variant="outline" 
        onClick={onGenerateData}
        className="flex items-center gap-2"
      >
        <Wand2 className="h-4 w-4" />
        Generate Test Data
      </Button>
    </div>
  );
};
