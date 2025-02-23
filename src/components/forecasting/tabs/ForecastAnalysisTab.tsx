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
import { Save, TrendingUp, TrendingDown, Calendar, BarChart2, History, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ModelParameter } from "@/types/models/commonTypes";
import { Database } from "@/integrations/supabase/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModelPerformanceMetrics {
  accuracy: number;
  trend: 'improving' | 'stable' | 'declining';
  trained_at: string;
  mape?: number;
  mae?: number;
  rmse?: number;
}

interface SavedModelConfig {
  id: string;
  model_id: string;
  parameters: ModelParameter[];
  created_at: string;
  performance_metrics?: ModelPerformanceMetrics;
}

interface ForecastAnalysisTabProps {
  filteredData: ForecastDataPoint[];
  confidenceIntervals: Array<{ upper: number; lower: number; }>;
}

const PatternAnalysisCard = ({ data }: { data: ForecastDataPoint[] }) => {
  const analyzePatterns = () => {
    const forecastValues = data.map(d => d.forecast).filter(f => f !== null) as number[];
    const actualValues = data.map(d => d.actual).filter(a => a !== null) as number[];
    
    const trend = forecastValues.length > 1 ? 
      forecastValues[forecastValues.length - 1] - forecastValues[0] : 0;
    
    const seasonality = actualValues.length >= 12 ? 
      Math.abs(Math.max(...actualValues) - Math.min(...actualValues)) / 
      (actualValues.reduce((a, b) => a + b, 0) / actualValues.length) : 0;
    
    const volatility = actualValues.length > 1 ?
      Math.sqrt(actualValues.reduce((sum, val) => 
        sum + Math.pow(val - (actualValues.reduce((a, b) => a + b, 0) / actualValues.length), 2), 0) 
        / (actualValues.length - 1)) : 0;

    return {
      trend,
      seasonality,
      volatility
    };
  };

  const patterns = analyzePatterns();

  return (
    <Card className="p-6 mt-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pattern Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {patterns.trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="font-medium">Trend</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {Math.abs(patterns.trend).toFixed(1)}% {patterns.trend >= 0 ? "Upward" : "Downward"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Overall directional movement in the forecast
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Seasonality</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {(patterns.seasonality * 100).toFixed(1)}% Variation
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cyclical patterns in the demand data
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Volatility</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {patterns.volatility.toFixed(1)} Units
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Measure of demand variability
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const ForecastAnalysisTab = ({
  filteredData,
  confidenceIntervals
}: ForecastAnalysisTabProps) => {
  const [selectedModel, setSelectedModel] = useState("exp-smoothing");
  const [modelParameters, setModelParameters] = useState<ModelParameter[]>([]);
  const [savedModels, setSavedModels] = useState<SavedModelConfig[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [modelPerformance, setModelPerformance] = useState<{
    accuracy: number;
    lastUpdated: string;
    trend: 'improving' | 'stable' | 'declining';
  }>({
    accuracy: 0,
    lastUpdated: '',
    trend: 'stable'
  });
  const [confidenceLevel, setConfidenceLevel] = useState<string>("95");

  useEffect(() => {
    fetchSavedModels();
    fetchModelPerformance();
  }, [selectedModel]);

  const fetchSavedModels = async () => {
    try {
      const { data: modelData, error: modelError } = await supabase
        .from('saved_model_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (modelError) {
        console.error('Error fetching models:', modelError);
        throw modelError;
      }

      if (!modelData || !Array.isArray(modelData)) {
        console.error('No model data returned or invalid format');
        setSavedModels([]);
        return;
      }

      const transformedData: SavedModelConfig[] = await Promise.all(
        modelData.map(async (item) => {
          try {
            const { data: metricsData, error: metricsError } = await supabase
              .from('model_training_history')
              .select('training_metrics, trained_at')
              .eq('model_version', item.model_id)
              .order('trained_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (metricsError) {
              console.error('Error fetching metrics:', metricsError);
              throw metricsError;
            }

            let parameters: ModelParameter[] = [];
            if (Array.isArray(item.parameters)) {
              parameters = item.parameters.map(param => {
                const p = param as Record<string, unknown>;
                return {
                  name: String(p.name || ''),
                  value: Number(p.value || 0),
                  min: p.min ? Number(p.min) : undefined,
                  max: p.max ? Number(p.max) : undefined,
                  step: p.step ? Number(p.step) : undefined,
                  description: String(p.description || '')
                };
              });
            }

            const rawMetrics = metricsData?.training_metrics as Record<string, unknown> | undefined;
            let metrics: ModelPerformanceMetrics | undefined;
            
            if (rawMetrics && typeof rawMetrics === 'object') {
              metrics = {
                accuracy: typeof rawMetrics.accuracy === 'number' ? rawMetrics.accuracy : 0,
                trend: (String(rawMetrics.trend || 'stable')) as 'improving' | 'stable' | 'declining',
                trained_at: metricsData.trained_at || new Date().toISOString(),
                mape: typeof rawMetrics.mape === 'number' ? rawMetrics.mape : undefined,
                mae: typeof rawMetrics.mae === 'number' ? rawMetrics.mae : undefined,
                rmse: typeof rawMetrics.rmse === 'number' ? rawMetrics.rmse : undefined
              };
            }

            return {
              id: item.id,
              model_id: item.model_id,
              parameters,
              created_at: item.created_at,
              performance_metrics: metrics
            };
          } catch (err) {
            console.error(`Error processing model ${item.model_id}:`, err);
            return {
              id: item.id,
              model_id: item.model_id,
              parameters: [],
              created_at: item.created_at,
              performance_metrics: undefined
            };
          }
        })
      );

      setSavedModels(transformedData);
    } catch (error) {
      console.error('Error fetching saved models:', error);
      toast.error('Failed to load saved models');
      setSavedModels([]);
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
        const rawMetrics = data[0].training_metrics as any;
        const metrics: ModelPerformanceMetrics = {
          accuracy: typeof rawMetrics?.accuracy === 'number' ? rawMetrics.accuracy : 0,
          trend: rawMetrics?.trend as 'improving' | 'stable' | 'declining' || 'stable',
          trained_at: data[0].trained_at
        };
        
        setModelPerformance({
          accuracy: metrics.accuracy,
          lastUpdated: new Date(metrics.trained_at).toLocaleDateString(),
          trend: metrics.trend
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

  const handleDeleteModel = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('saved_model_configs')
        .delete()
        .eq('id', modelId);

      if (error) throw error;
      toast.success('Model configuration deleted successfully');
      fetchSavedModels();
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Failed to delete model configuration');
    }
  };

  const handleSaveModel = async () => {
    try {
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

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Saved Models</h3>
            <div className="space-y-2">
              {savedModels.map((model) => (
                <div
                  key={model.id}
                  className="space-y-2 bg-muted rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center">
                      <History className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">{model.model_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedModel(model.model_id);
                        setModelParameters(model.parameters);
                      }}>
                        Load
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setExpandedModel(expandedModel === model.id ? null : model.id)}
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
                        onClick={() => handleDeleteModel(model.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {expandedModel === model.id && model.performance_metrics && (
                    <div className="p-3 bg-background/50 border-t space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Accuracy</p>
                          <p className="text-sm font-medium">
                            {model.performance_metrics.accuracy?.toFixed(2)}%
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
                      <p className="text-xs text-muted-foreground">
                        Trend: {model.performance_metrics.trend}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <ForecastMetricsCards metrics={metrics} />
      
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Forecast Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Visual analysis of forecasted values with confidence intervals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Confidence Level:</span>
              <Select
                value={confidenceLevel}
                onValueChange={setConfidenceLevel}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="95%" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                  <SelectItem value="99">99%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="h-[400px]">
            <ForecastChart 
              data={filteredData} 
              confidenceIntervals={confidenceIntervals}
              confidenceLevel={Number(confidenceLevel)}
            />
          </div>
        </div>
      </Card>

      <PatternAnalysisCard data={filteredData} />
    </div>
  );
};

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

  const mape = actualValues.reduce((sum, actual, i) => {
    return sum + Math.abs((actual - forecastValues[i]) / actual);
  }, 0) / actualValues.length * 100;

  const mae = actualValues.reduce((sum, actual, i) => {
    return sum + Math.abs(actual - forecastValues[i]);
  }, 0) / actualValues.length;

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
