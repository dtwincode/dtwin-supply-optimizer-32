
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { defaultModelConfigs } from "@/types/modelParameters";

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
  return (
    <div className="flex gap-4">
      <Select value={timeRange} onValueChange={onTimeRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30">Last 30 Days</SelectItem>
          <SelectItem value="60">Last 60 Days</SelectItem>
          <SelectItem value="90">Last 90 Days</SelectItem>
          <SelectItem value="180">Last 180 Days</SelectItem>
        </SelectContent>
      </Select>
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
