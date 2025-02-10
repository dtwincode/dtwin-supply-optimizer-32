
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wand2, Calendar as CalendarIcon } from "lucide-react";
import { defaultModelConfigs } from "@/types/modelParameters";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
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
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 30))
  });

  return (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal w-[240px]",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
              setDate(range);
              if (range?.from && range?.to) {
                const days = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
                onTimeRangeChange(days.toString());
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

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
