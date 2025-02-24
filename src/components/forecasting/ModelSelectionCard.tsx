
import { Card } from "@/components/ui/card";
import { ModelParametersDialog } from "./ModelParametersDialog";
import { basicModels } from "@/types/models/basicModels";
import { advancedModels } from "@/types/models/advancedModels";
import { seasonalModels } from "@/types/models/seasonalModels";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ModelParameter } from "@/types/models/commonTypes";
import { Button } from "@/components/ui/button";
import { PlayCircle, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { findBestFitModel, getModelExample } from "@/utils/forecasting/modelSelection";
import { useState } from "react";

interface ModelSelectionCardProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onParametersChange: (modelId: string, parameters: ModelParameter[]) => void;
  data?: number[];
}

export const ModelSelectionCard = ({
  selectedModel,
  onModelChange,
  onParametersChange,
  data = []
}: ModelSelectionCardProps) => {
  const [isAutoSelecting, setIsAutoSelecting] = useState(false);
  const allModels = [...basicModels, ...advancedModels, ...seasonalModels];
  const currentModel = allModels.find(m => m.id === selectedModel) || allModels[0];

  const handleParametersChange = (params: ModelParameter[]) => {
    onParametersChange(currentModel.id, params);
  };

  const handleRunModel = () => {
    toast.success(`Running ${currentModel.name} model...`);
    onParametersChange(currentModel.id, currentModel.parameters);
  };

  const handleAutomaticSelection = async () => {
    if (!data.length) {
      toast.error("No data available for model selection");
      return;
    }

    setIsAutoSelecting(true);
    toast.loading("Analyzing and selecting the best model...");

    try {
      // Simulate running all models (in a real app, you'd run actual forecasts)
      const modelResults = allModels.map(model => ({
        modelId: model.id,
        modelName: model.name,
        forecast: data.map((val, i) => val * (1 + Math.sin(i) * 0.1)) // Dummy forecast
      }));

      const bestModel = findBestFitModel(data, modelResults);
      const modelExample = getModelExample(bestModel.modelId, data);

      onModelChange(bestModel.modelId);
      toast.success(`Selected ${bestModel.modelName} as the best fit model`, {
        description: modelExample.description
      });

      // Update parameters if available
      if (bestModel.optimizedParameters) {
        onParametersChange(bestModel.modelId, bestModel.optimizedParameters);
      }
    } catch (error) {
      toast.error("Error selecting the best model");
      console.error("Model selection error:", error);
    } finally {
      setIsAutoSelecting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Model Selection</h3>
          <p className="text-sm text-muted-foreground">
            Choose and configure your forecasting model
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Select
              value={selectedModel}
              onValueChange={onModelChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Models</SelectLabel>
                  {allModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <ModelParametersDialog
              model={currentModel}
              onParametersChange={handleParametersChange}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleRunModel}
              className="flex-1"
              variant="default"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Run Model
            </Button>
            <Button
              onClick={handleAutomaticSelection}
              variant="secondary"
              disabled={isAutoSelecting}
              className="flex-1"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Auto Select
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
