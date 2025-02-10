import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Settings, Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ModelConfig, ModelParameter } from "@/types/modelParameters";
import { useToast } from "@/hooks/use-toast";
import { optimizeModelParameters } from "@/utils/forecasting/modelOptimization";

interface ModelParametersDialogProps {
  model: ModelConfig;
  onParametersChange: (modelId: string, parameters: ModelParameter[]) => void;
  historicalData?: number[];
}

export function ModelParametersDialog({ 
  model, 
  onParametersChange,
  historicalData 
}: ModelParametersDialogProps) {
  const [parameters, setParameters] = useState<ModelParameter[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setParameters(model.parameters);
  }, [model]);

  const handleParameterChange = (paramName: string, value: number) => {
    setParameters(prev =>
      prev.map(param =>
        param.name === paramName ? { ...param, value } : param
      )
    );
  };

  const handleAutoOptimize = () => {
    if (!historicalData || historicalData.length === 0) {
      toast({
        title: "Auto-optimization failed",
        description: "Historical data is required for parameter optimization.",
        variant: "destructive",
      });
      return;
    }

    const optimizedParams = optimizeModelParameters(historicalData);
    const modelOptimizedParams = optimizedParams.find(p => p.modelId === model.id);

    if (modelOptimizedParams) {
      setParameters(prev =>
        prev.map(param => {
          const optimized = modelOptimizedParams.parameters.find(
            p => p.name === param.name
          );
          return optimized ? { ...param, value: optimized.value } : param;
        })
      );

      toast({
        title: "Parameters Optimized",
        description: `${model.name} parameters have been automatically optimized based on historical data.`,
      });
    }
  };

  const handleSave = () => {
    onParametersChange(model.id, parameters);
    toast({
      title: "Parameters Updated",
      description: `${model.name} parameters have been updated successfully.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Parameters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{model.name} Parameters</DialogTitle>
          <DialogDescription>
            Adjust the parameters for the {model.name} forecasting model.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button 
            variant="outline" 
            onClick={handleAutoOptimize}
            className="w-full"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Auto-optimize Parameters
          </Button>
          {parameters.map((param) => (
            <div key={param.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium leading-none capitalize">
                  {param.name.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <span className="text-sm text-gray-500">
                  {param.value}
                </span>
              </div>
              <Slider
                value={[param.value]}
                min={param.min}
                max={param.max}
                step={param.step}
                onValueChange={([value]) => handleParameterChange(param.name, value)}
              />
              <p className="text-xs text-gray-500">{param.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
