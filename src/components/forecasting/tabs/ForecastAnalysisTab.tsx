
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";
import { Card } from "@/components/ui/card";
import { ForecastDataPoint } from "@/types/forecasting";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, TrendingUp, TrendingDown, History, Trash2, ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import { ModelParameter } from "@/types/models/commonTypes";
import { PatternAnalysisCard } from "../components/PatternAnalysisCard";

const sampleData: ForecastDataPoint[] = Array.from({ length: 24 }, (_, i) => {
  const baseValue = 1000;
  const trend = i * 10;
  const seasonality = Math.sin(i * Math.PI / 6) * 200;
  const noise = Math.random() * 50 - 25;
  
  const actual = i < 18 ? baseValue + trend + seasonality + noise : null;
  const forecast = baseValue + trend + seasonality;
  
  return {
    id: `data-${i}`,
    week: new Date(2023, i, 1).toISOString().split('T')[0],
    actual,
    forecast,
    variance: actual !== null ? actual - forecast : null,
    region: "North America",
    city: "New York",
    channel: "Retail",
    warehouse: "Main Hub",
    category: "Electronics",
    subcategory: "Smartphones",
    sku: "PHONE-001",
    l1_main_prod: "Electronics",
    l2_prod_line: "Mobile Devices",
    l3_prod_category: "Smartphones",
    l4_device_make: "TechBrand",
    l5_prod_sub_category: "Premium",
    l6_device_model: "X2000",
    l7_device_color: "Black",
    l8_device_storage: "256GB"
  };
});

const sampleConfidenceIntervals = sampleData.map((_, i) => {
  const baseValue = 1000 + i * 10;
  const uncertainty = Math.sqrt(i) * 50;
  return {
    upper: baseValue + uncertainty,
    lower: baseValue - uncertainty
  };
});

const calculateMetrics = (data: ForecastDataPoint[]) => {
  const validPairs = data.filter(d => 
    d.actual !== null && 
    d.forecast !== null && 
    typeof d.actual === 'number' && 
    typeof d.forecast === 'number'
  );

  if (validPairs.length === 0) {
    return {
      mape: 0,
      mae: 0,
      rmse: 0
    };
  }

  const mape = validPairs.reduce((sum, d) => {
    const actual = d.actual as number;
    if (actual === 0) return sum; // Avoid division by zero
    return sum + Math.abs((actual - (d.forecast as number)) / actual);
  }, 0) / validPairs.length * 100;

  const mae = validPairs.reduce((sum, d) => 
    sum + Math.abs((d.actual as number) - (d.forecast as number))
  , 0) / validPairs.length;

  const rmse = Math.sqrt(
    validPairs.reduce((sum, d) => 
      sum + Math.pow((d.actual as number) - (d.forecast as number), 2)
    , 0) / validPairs.length
  );

  return {
    mape,
    mae,
    rmse
  };
};

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

const ForecastAnalysisTab = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [modelParameters, setModelParameters] = useState<ModelParameter[]>([]);
  const [savedModels, setSavedModels] = useState<SavedModelConfig[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<string>("95");
  const [modelPerformance, setModelPerformance] = useState<{
    accuracy: number;
    lastUpdated: string;
    trend: 'improving' | 'stable' | 'declining';
  }>({
    accuracy: 85.5,
    lastUpdated: '2024-03-20',
    trend: 'improving'
  });

  useEffect(() => {
    setSavedModels([
      {
        id: "model-1",
        model_id: "exp-smoothing",
        parameters: [
          { name: "alpha", value: 0.3, min: 0, max: 1, step: 0.1, description: "Smoothing factor" }
        ],
        created_at: "2024-03-15",
        performance_metrics: {
          accuracy: 85.5,
          trend: 'improving',
          trained_at: "2024-03-15",
          mape: 14.5,
          mae: 120,
          rmse: 150
        }
      },
      {
        id: "model-2",
        model_id: "arima",
        parameters: [
          { name: "p", value: 1, min: 0, max: 5, step: 1, description: "AR order" },
          { name: "d", value: 1, min: 0, max: 2, step: 1, description: "Difference order" },
          { name: "q", value: 1, min: 0, max: 5, step: 1, description: "MA order" }
        ],
        created_at: "2024-03-10",
        performance_metrics: {
          accuracy: 83.2,
          trend: 'stable',
          trained_at: "2024-03-10",
          mape: 16.8,
          mae: 140,
          rmse: 175
        }
      }
    ]);
  }, []);

  const handleModelChange = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(prev => prev.filter(id => id !== modelId));
    } else if (selectedModels.length < 3) {
      setSelectedModels(prev => [...prev, modelId]);
    } else {
      toast.warning("Maximum 3 models can be compared at once");
    }

    if (modelId === "exp-smoothing") {
      setModelParameters([
        { name: "alpha", value: 0.3, min: 0, max: 1, step: 0.1, description: "Smoothing factor" }
      ]);
    } else if (modelId === "arima") {
      setModelParameters([
        { name: "p", value: 1, min: 0, max: 5, step: 1, description: "AR order" },
        { name: "d", value: 1, min: 0, max: 2, step: 1, description: "Difference order" },
        { name: "q", value: 1, min: 0, max: 5, step: 1, description: "MA order" }
      ]);
    }
  };

  const handleParametersChange = (modelId: string, parameters: ModelParameter[]) => {
    setModelParameters(parameters);
  };

  const handleSaveModel = async () => {
    toast.success('Model configuration saved successfully');
  };

  const handleDeleteModel = async (modelId: string) => {
    setSavedModels(prev => prev.filter(model => model.id !== modelId));
    toast.success('Model configuration deleted successfully');
  };

  const metrics = calculateMetrics(sampleData);

  const compareModels = () => {
    const selectedModelConfigs = savedModels.filter(model => 
      selectedModels.includes(model.model_id)
    );

    return (
      <Card className="p-6 mt-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Model Comparison</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedModels([])}
            >
              Clear Selection
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedModelConfigs.map(model => (
              <Card key={model.id} className="p-4 relative">
                <div className="space-y-2">
                  <h4 className="font-medium">{model.model_id}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Accuracy:</span>
                      <span className="text-sm font-medium">
                        {model.performance_metrics?.accuracy.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">MAPE:</span>
                      <span className="text-sm font-medium">
                        {model.performance_metrics?.mape.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">MAE:</span>
                      <span className="text-sm font-medium">
                        {model.performance_metrics?.mae.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">RMSE:</span>
                      <span className="text-sm font-medium">
                        {model.performance_metrics?.rmse.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <ModelSelectionCard
          selectedModel={selectedModels[0] || ""}
          onModelChange={handleModelChange}
          onParametersChange={handleParametersChange}
        />
        <Button 
          variant="outline"
          className="h-10"
          onClick={() => handleModelChange("exp-smoothing")}
          disabled={selectedModels.includes("exp-smoothing")}
        >
          <BarChart2 className="mr-2 h-4 w-4" />
          Compare
        </Button>
      </div>

      {selectedModels.length > 0 && compareModels()}

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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedModels([model.model_id]); // Fixed: Wrap in array
                          setModelParameters(model.parameters);
                        }}
                      >
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
                            {model.performance_metrics.accuracy.toFixed(2)}%
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
              data={sampleData} 
              confidenceIntervals={sampleConfidenceIntervals}
              confidenceLevel={Number(confidenceLevel)}
            />
          </div>
        </div>
      </Card>

      <PatternAnalysisCard data={sampleData} />
    </div>
  );
};

export default ForecastAnalysisTab;
