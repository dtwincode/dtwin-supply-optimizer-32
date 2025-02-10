
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
  fromDate: Date;
  toDate: Date;
  onDateRangeChange: (from: Date, to: Date) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onGenerateData: () => void;
}

export const ChartControls = ({
  fromDate,
  toDate,
  onDateRangeChange,
  selectedModel,
  onModelChange,
  onGenerateData
}: ChartControlsProps) => {
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
                  onDateRangeChange(date, toDate);
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
                  onDateRangeChange(fromDate, date);
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
