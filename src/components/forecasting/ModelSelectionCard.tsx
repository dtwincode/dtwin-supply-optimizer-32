
import { Card } from "@/components/ui/card";
import { ModelParametersDialog } from "./ModelParametersDialog";
import { basicModels } from "@/types/models/basicModels";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Model Selection</h3>
          <p className="text-sm text-muted-foreground">
            Choose and configure your forecasting model
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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

          <div>
            <ModelParametersDialog
              model={currentModel}
              onParametersChange={(params) => onParametersChange(currentModel.id, params)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
