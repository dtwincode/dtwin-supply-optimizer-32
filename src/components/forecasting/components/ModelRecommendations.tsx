
import { Card } from "@/components/ui/card";
import { Award, TrendingUp, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SavedModelConfig } from "@/types/forecasting";

interface ModelRecommendationsProps {
  models: SavedModelConfig[];
  onSelectModel: (modelId: string) => void;
}

export const ModelRecommendations = ({ models, onSelectModel }: ModelRecommendationsProps) => {
  const getBestModels = () => {
    return models
      .filter(m => m.performance_metrics)
      .sort((a, b) => 
        (b.performance_metrics?.accuracy || 0) - (a.performance_metrics?.accuracy || 0)
      )
      .slice(0, 3);
  };

  const bestModels = getBestModels();

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recommended Models</h3>
          <span className="text-sm text-muted-foreground">
            Based on historical performance
          </span>
        </div>
        <div className="grid gap-4">
          {bestModels.map((model, index) => (
            <div 
              key={model.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                {index === 0 ? (
                  <Award className="h-5 w-5 text-yellow-500" />
                ) : index === 1 ? (
                  <Award className="h-5 w-5 text-gray-400" />
                ) : (
                  <Award className="h-5 w-5 text-amber-600" />
                )}
                <div>
                  <div className="font-medium">{model.model_id}</div>
                  <div className="text-sm text-muted-foreground">
                    Accuracy: {model.performance_metrics?.accuracy.toFixed(2)}%
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectModel(model.model_id)}
              >
                Select Model
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
