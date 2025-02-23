
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";
import { Card } from "@/components/ui/card";
import { ForecastDataPoint } from "@/types/forecasting";
import { useState, useEffect } from "react";
import { findBestFitModel } from "@/utils/forecasting/modelSelection";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, TrendingUp, History } from "lucide-react"; 
import { supabase } from "@/integrations/supabase/client";
import { ModelParameter } from "@/types/models/commonTypes";
import { Database } from "@/integrations/supabase/types";

interface ModelPerformanceMetrics {
  accuracy: number;
  trend: 'improving' | 'stable' | 'declining';
  trained_at: string;
}

interface SavedModelConfig {
  id: string;
  model_id: string;
  parameters: ModelParameter[];
  created_at: string;
}

interface ForecastAnalysisTabProps {
  filteredData: ForecastDataPoint[];
  confidenceIntervals: Array<{ upper: number; lower: number; }>;
}

export const ForecastAnalysisTab = ({
  filteredData,
  confidenceIntervals
}: ForecastAnalysisTabProps) => {
  const [selectedModel, setSelectedModel] = useState("exp-smoothing");
  const [modelParameters, setModelParameters] = useState<ModelParameter[]>([]);
  const [savedModels, setSavedModels] = useState<SavedModelConfig[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [modelPerformance, setModelPerformance] = useState<{
    accuracy: number;
    lastUpdated: string;
    trend: 'improving' | 'stable' | 'declining';
  }>({
    accuracy: 0,
    lastUpdated: '',
    trend: 'stable'
  });

  useEffect(() => {
    fetchSavedModels();
    fetchModelPerformance();
  }, [selectedModel]);

  const fetchSavedModels = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_model_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match SavedModelConfig type
      const transformedData: SavedModelConfig[] = (data || []).map(item => ({
        id: item.id,
        model_id: item.model_id,
        parameters: Array.isArray(item.parameters) ? item.parameters : [],
        created_at: item.created_at
      }));

      setSavedModels(transformedData);
    } catch (error) {
      console.error('Error fetching saved models:', error);
      toast.error('Failed to load saved models');
    }
  };

  const fetchModelPerformance = async () => {
    try {
      const { data, error } = await supabase
        .from('model_training_history')
        .select('training_metrics, trained_at')
        .eq('model_version', selectedModel)
        .order('trained_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data[0]) {
        // Safely type cast the training metrics
        const rawMetrics = data[0].training_metrics as unknown;
        const metrics = rawMetrics as ModelPerformanceMetrics;
        
        setModelPerformance({
          accuracy: typeof metrics?.accuracy === 'number' ? metrics.accuracy : 0,
          lastUpdated: new Date(data[0].trained_at).toLocaleDateString(),
          trend: metrics?.trend || 'stable'
        });
      }
    } catch (error) {
      console.error('Error fetching model performance:', error);
      toast.error('Failed to load model performance data');
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleParametersChange = (modelId: string, parameters: ModelParameter[]) => {
    setModelParameters(parameters);
  };

  const handleSaveModel = async () => {
    try {
      // Convert ModelParameter[] to a JSON-compatible format
      const parametersJson = modelParameters.map(param => ({
        name: param.name,
        value: param.value,
        min: param.min,
        max: param.max,
        step: param.step,
        description: param.description
      }));

      const { error } = await supabase
        .from('saved_model_configs')
        .insert({
          model_id: selectedModel,
          parameters: parametersJson,
          product_id: 'default',
          product_name: 'Default Product',
          auto_run: true
        });

      if (error) throw error;
      toast.success('Model configuration saved successfully');
      fetchSavedModels();
    } catch (error) {
      console.error('Error saving model:', error);
      toast.error('Failed to save model configuration');
    }
  };

  const metrics = calculateMetrics(filteredData);

  return (
    <div className="space-y-6">
      <ModelSelectionCard
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onParametersChange={handleParametersChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Performance Monitoring Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Model Performance</h3>
              <Button variant="outline" size="sm" onClick={handleSaveModel}>
                <Save className="h-4 w-4 mr-2" />
                Save Model
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Accuracy Trend</span>
                <div className="flex items-center">
                  <TrendingUp className={`h-4 w-4 mr-2 ${
                    modelPerformance.trend === 'improving' ? 'text-green-500' :
                    modelPerformance.trend === 'declining' ? 'text-red-500' :
                    'text-yellow-500'
                  }`} />
                  <span className="text-sm font-medium">{modelPerformance.accuracy.toFixed(2)}%</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: {modelPerformance.lastUpdated}
              </div>
            </div>
          </div>
        </Card>

        {/* Saved Models Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Saved Models</h3>
            <div className="space-y-2">
              {savedModels.map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div className="flex items-center">
                    <History className="h-4 w-4 mr-2" />
                    <span className="text-sm">{model.model_id}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedModel(model.model_id);
                    setModelParameters(model.parameters);
                  }}>
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <ForecastMetricsCards metrics={metrics} />
      
      <Card className="p-6">
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold">Forecast Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Visual analysis of forecasted values with confidence intervals
          </p>
        </div>
        <div className="h-[400px]">
          <ForecastChart 
            data={filteredData} 
            confidenceIntervals={confidenceIntervals}
          />
        </div>
      </Card>
    </div>
  );
};

// Helper function to calculate metrics
const calculateMetrics = (data: ForecastDataPoint[]) => {
  const actualValues = data.filter(d => d.actual !== null).map(d => d.actual!);
  const forecastValues = data.filter(d => d.actual !== null).map(d => d.forecast);
  
  if (actualValues.length === 0) {
    return {
      mape: 0,
      mae: 0,
      rmse: 0
    };
  }

  // Calculate MAPE
  const mape = actualValues.reduce((sum, actual, i) => {
    return sum + Math.abs((actual - forecastValues[i]) / actual);
  }, 0) / actualValues.length * 100;

  // Calculate MAE
  const mae = actualValues.reduce((sum, actual, i) => {
    return sum + Math.abs(actual - forecastValues[i]);
  }, 0) / actualValues.length;

  // Calculate RMSE
  const rmse = Math.sqrt(
    actualValues.reduce((sum, actual, i) => {
      return sum + Math.pow(actual - forecastValues[i], 2);
    }, 0) / actualValues.length
  );

  return {
    mape,
    mae,
    rmse
  };
};
