
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useParamConfig } from "@/hooks/useParamConfig";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelParametersTuningProps {
  modelId: string;
  onParameterChange: (key: string, value: number) => void;
  currentValues: { [key: string]: number };
}

export const ModelParametersTuning = ({
  modelId,
  onParameterChange,
  currentValues,
}: ModelParametersTuningProps) => {
  const { getParamConfig } = useParamConfig();
  const parameters = getParamConfig(modelId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Model Parameters</h4>
      </div>
      
      <div className="space-y-4">
        {parameters.map((param) => (
          <div key={param.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={param.key} className="text-sm font-medium">
                {param.name}
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-sm">{param.description}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id={param.key}
                min={param.min}
                max={param.max}
                step={param.step}
                value={[currentValues[param.key] || param.min]}
                onValueChange={([value]) => onParameterChange(param.key, value)}
                className="flex-1"
              />
              <span className="w-12 text-sm text-muted-foreground">
                {currentValues[param.key]?.toFixed(2) || param.min}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
