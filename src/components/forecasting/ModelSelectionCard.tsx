
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
import { PlayCircle, Settings2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { findBestFitModel, getModelExample } from "@/utils/forecasting/modelSelection";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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
        forecast: data.map((val, i) => val * (1 + Math.sin(i) * 0.1))
      }));

      const bestModel = findBestFitModel(data, modelResults);
      const modelExample = getModelExample(bestModel.modelId, data);

      onModelChange(bestModel.modelId);
      toast.success(`Selected ${bestModel.modelName} as the best fit model`, {
        description: modelExample.description
      });

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Model Selection & Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            type="search" 
            placeholder="Search models..." 
            className="w-full"
          />
          <Select defaultValue="all-skus">
            <SelectTrigger>
              <SelectValue placeholder="All SKUs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-skus">All SKUs</SelectItem>
              <SelectItem value="selected">Selected SKUs</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-locations">
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-locations">All Locations</SelectItem>
              <SelectItem value="selected">Selected Locations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Model Selection</h3>
            <p className="text-muted-foreground">
              Choose and configure your forecasting model
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-2">
              <Select
                value={selectedModel}
                onValueChange={onModelChange}
              >
                <SelectTrigger className="h-10">
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
              <Button 
                variant="outline" 
                className="w-full h-10"
                asChild
              >
                <ModelParametersDialog
                  model={currentModel}
                  onParametersChange={handleParametersChange}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Parameters
                  </div>
                </ModelParametersDialog>
              </Button>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleRunModel}
                className="flex-1 h-10"
                variant="default"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Run Model
              </Button>
              <Button
                onClick={handleAutomaticSelection}
                variant="secondary"
                disabled={isAutoSelecting}
                className="flex-1 h-10"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Auto Select
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
