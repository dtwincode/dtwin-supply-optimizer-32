
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
import { useState, useEffect } from "react";
import { ModelConfig } from "@/types/models/commonTypes";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActiveModel {
  id: string;
  model_id: string;
  model_name: string;
  is_running: boolean;
  last_run?: Date;
  product_filters: Record<string, any>;
  model_parameters: Record<string, any>;
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

  // Fetch active models on component mount
  useEffect(() => {
    const fetchActiveModels = async () => {
      try {
        const { data, error } = await supabase
          .from('active_models')
          .select('*');

        if (error) throw error;
        setActiveModels(data || []);
      } catch (error) {
        console.error('Error fetching active models:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch active models",
        });
      }
    };

    fetchActiveModels();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('active_models_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_models'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          fetchActiveModels(); // Refresh the list when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleModelActivation = async () => {
    const modelConfig = modelConfigs.find(m => m.id === selectedModel);
    if (!modelConfig) return;

    const isAlreadyActive = activeModels.some(m => m.model_id === selectedModel);
    if (isAlreadyActive) {
      toast({
        title: "Model Already Active",
        description: "This model is already in the active models list.",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('active_models')
        .insert({
          model_id: selectedModel,
          model_name: modelConfig.name,
          is_running: true,
          product_filters: {},
          model_parameters: modelConfig.parameters
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Model Activated",
        description: `${modelConfig.name} has been added to active models.`,
      });
    } catch (error) {
      console.error('Error activating model:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to activate model",
      });
    }
  };

  const toggleModelRunning = async (modelId: string) => {
    const model = activeModels.find(m => m.id === modelId);
    if (!model) return;

    try {
      const { error } = await supabase
        .from('active_models')
        .update({ is_running: !model.is_running })
        .eq('id', modelId);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling model:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update model status",
      });
    }
  };

  const removeActiveModel = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('active_models')
        .delete()
        .eq('id', modelId);

      if (error) throw error;

      toast({
        title: "Model Removed",
        description: "The model has been removed from active models.",
      });
    } catch (error) {
      console.error('Error removing model:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove model",
      });
    }
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
                    <p className="font-medium">{model.model_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last run: {new Date(model.last_run || '').toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={model.is_running}
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
