
import { Button } from "@/components/ui/button";
import { FileDown, Settings, Play, Pause } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ModelParametersDialog } from "./ModelParametersDialog";
import { useState } from "react";
import { ModelConfig } from "@/types/models/commonTypes";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface ActiveModel {
  id: string;
  name: string;
  isRunning: boolean;
  lastRun?: Date;
}

interface ForecastingHeaderProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  handleExport: () => void;
  findBestModel: () => void;
  modelConfigs: ModelConfig[];
}

export const ForecastingHeader = ({
  selectedModel,
  setSelectedModel,
  handleExport,
  findBestModel,
  modelConfigs,
}: ForecastingHeaderProps) => {
  const [activeModels, setActiveModels] = useState<ActiveModel[]>([]);
  
  const handleModelActivation = () => {
    const modelConfig = modelConfigs.find(m => m.id === selectedModel);
    if (!modelConfig) return;

    const isAlreadyActive = activeModels.some(m => m.id === selectedModel);
    if (isAlreadyActive) {
      toast({
        title: "Model Already Active",
        description: "This model is already in the active models list.",
      });
      return;
    }

    setActiveModels(prev => [...prev, {
      id: selectedModel,
      name: modelConfig.name,
      isRunning: true,
      lastRun: new Date()
    }]);

    toast({
      title: "Model Activated",
      description: `${modelConfig.name} has been added to active models.`,
    });
  };

  const toggleModelRunning = (modelId: string) => {
    setActiveModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, isRunning: !model.isRunning }
        : model
    ));
  };

  const removeActiveModel = (modelId: string) => {
    setActiveModels(prev => prev.filter(model => model.id !== modelId));
    toast({
      title: "Model Removed",
      description: "The model has been removed from active models.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moving-avg">Moving Average</SelectItem>
              <SelectItem value="exp-smoothing">Exponential Smoothing</SelectItem>
              <SelectItem value="arima">ARIMA</SelectItem>
              <SelectItem value="prophet">Prophet</SelectItem>
              <SelectItem value="sarima">Seasonal ARIMA</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Parameters
          </Button>

          <Button variant="outline" onClick={findBestModel} className="flex items-center gap-2">
            Find Best Model
          </Button>

          <Button 
            variant="default" 
            onClick={handleModelActivation}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run Model
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Active Models Section */}
      {activeModels.length > 0 && (
        <div className="bg-secondary/5 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-4">Active Models</h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeModels.map((model) => (
              <Card key={model.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{model.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last run: {model.lastRun?.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={model.isRunning}
                      onCheckedChange={() => toggleModelRunning(model.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeActiveModel(model.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
