
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart2, ChevronDown, ChevronUp, History, Trash2 } from "lucide-react";
import { SavedModelConfig } from "@/types/forecasting";
import { toast } from "sonner";

interface ModelListProps {
  models: SavedModelConfig[];
  selectedModels: string[];
  expandedModel: string | null;
  onModelSelect: (modelId: string) => void;
  onExpandModel: (modelId: string | null) => void;
  onDeleteModel: (modelId: string) => void;
}

export const ModelList = ({
  models,
  selectedModels,
  expandedModel,
  onModelSelect,
  onExpandModel,
  onDeleteModel
}: ModelListProps) => {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-muted rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <History className="h-4 w-4" />
                <div>
                  <div className="font-medium">{model.model_id}</div>
                  <div className="text-xs text-muted-foreground">
                    {model.sku && `SKU: ${model.sku}`} {model.location_id && `| Location: ${model.location_id}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    if (selectedModels.includes(model.model_id)) {
                      onModelSelect(model.model_id);
                    } else if (selectedModels.length < 3) {
                      onModelSelect(model.model_id);
                    } else {
                      toast.warning("Maximum 3 models can be compared at once");
                    }
                  }}
                >
                  <BarChart2 className="h-4 w-4 mr-1" />
                  {selectedModels.includes(model.model_id) ? "Remove" : "Compare"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onExpandModel(expandedModel === model.id ? null : model.id)}
                >
                  {expandedModel === model.id ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDeleteModel(model.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {expandedModel === model.id && model.performance_metrics && (
              <div className="p-3 bg-background/50 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      {model.performance_metrics.accuracy.toFixed(2)}%
                      <TrendingUp className={`h-4 w-4 ${
                        model.performance_metrics.trend === 'improving' ? 'text-green-500' :
                        model.performance_metrics.trend === 'declining' ? 'text-red-500' :
                        'text-yellow-500'
                      }`} />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MAPE</p>
                    <p className="text-sm font-medium">
                      {model.performance_metrics.mape?.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MAE</p>
                    <p className="text-sm font-medium">
                      {model.performance_metrics.mae?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RMSE</p>
                    <p className="text-sm font-medium">
                      {model.performance_metrics.rmse?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
