
import { Card } from "@/components/ui/card";
import { ModelParametersDialog } from "./ModelParametersDialog";
import { basicModels } from "@/types/models/basicModels";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModelSelectionCardProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  onParametersChange: (modelId: string, parameters: any[]) => void;
}

export const ModelSelectionCard = ({
  selectedModel,
  onModelChange,
  onParametersChange,
}: ModelSelectionCardProps) => {
  const currentModel = basicModels.find(m => m.id === selectedModel) || basicModels[0];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Model Selection</h3>
          <p className="text-sm text-muted-foreground">
            Choose and configure your forecasting model
          </p>
        </div>
        <ModelParametersDialog
          model={currentModel}
          onParametersChange={onParametersChange}
        />
      </div>

      <div className="mt-4">
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
              {basicModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
