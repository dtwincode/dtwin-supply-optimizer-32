
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Wand2, ArrowRight, BarChart2, LineChart } from "lucide-react";
import { useModelVersions } from "@/hooks/useModelVersions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelConfig } from "@/types/models/commonTypes";
import { basicModels } from "@/types/models/basicModels";
import { seasonalModels } from "@/types/models/seasonalModels";
import { ModelParametersTuning } from "./ModelParametersTuning";
import { useState } from "react";

interface ModelSelectionCardProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onOptimize: () => void;
}

export const ModelSelectionCard = ({
  selectedModel,
  onModelChange,
  onOptimize,
}: ModelSelectionCardProps) => {
  const { versions, isLoading } = useModelVersions(selectedModel);
  const allModels = [...basicModels, ...seasonalModels];
  const [parameters, setParameters] = useState<{ [key: string]: number }>({});

  const handleParameterChange = (key: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
    console.log(`Parameter ${key} changed to ${value}`);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Model Selection</h3>
            <p className="text-sm text-muted-foreground">
              Choose and optimize your forecasting model
            </p>
          </div>
          <Button onClick={onOptimize} className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Auto-Optimize
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Model Type</label>
              <Select
                value={selectedModel}
                onValueChange={onModelChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Basic Models</SelectLabel>
                    {basicModels.map((model: ModelConfig) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Seasonal Models</SelectLabel>
                    {seasonalModels.map((model: ModelConfig) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {selectedModel && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Model Description</label>
                <p className="text-sm text-muted-foreground">
                  {allModels.find(m => m.id === selectedModel)?.parameters[0]?.description || 
                   "Advanced forecasting model with configurable parameters"}
                </p>
              </div>
            )}

            <ModelParametersTuning
              modelId={selectedModel}
              onParameterChange={handleParameterChange}
              currentValues={parameters}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Model Performance</span>
              {!isLoading && versions[0] && (
                <span className="text-sm text-muted-foreground">
                  Latest Version: {versions[0].version}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">
                    {versions[0]?.accuracy_metrics.mape.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">MAPE</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">
                    {versions[0]?.accuracy_metrics.rmse.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">RMSE</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button variant="outline" className="flex items-center gap-2">
            View Model Details
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
