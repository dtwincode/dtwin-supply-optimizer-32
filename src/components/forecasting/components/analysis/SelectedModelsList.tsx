
import { Button } from "@/components/ui/button";

interface SelectedModelsListProps {
  selectedModels: string[];
  models: { id: string; model_id: string; }[];
  onRemoveModel: (modelId: string) => void;
  onClearAll: () => void;
}

export const SelectedModelsList = ({
  selectedModels,
  models,
  onRemoveModel,
  onClearAll
}: SelectedModelsListProps) => {
  if (selectedModels.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Selected Models for Comparison</h4>
      <div className="flex flex-wrap gap-2">
        {selectedModels.map(modelId => {
          const model = models.find(m => m.model_id === modelId);
          return model && (
            <div 
              key={model.id} 
              className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2"
            >
              <span className="text-sm">{model.model_id}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveModel(modelId)}
                className="h-5 w-5 p-0"
              >
                ×
              </Button>
            </div>
          );
        })}
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearAll}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};
