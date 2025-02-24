import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";
import { Card } from "@/components/ui/card";
import { ForecastDataPoint } from "@/types/forecasting";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TrendingUp, History, Trash2, ChevronDown, ChevronUp, BarChart2, Search } from "lucide-react";
import { ModelParameter } from "@/types/models/commonTypes";
import { PatternAnalysisCard } from "../components/PatternAnalysisCard";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnomalyDetection } from "../components/AnomalyDetection";
import { ErrorDistribution } from "../components/ErrorDistribution";
import { ModelRecommendations } from "../components/ModelRecommendations";
import { TeamCollaboration } from "../components/TeamCollaboration";

interface SavedModelConfig {
  id: string;
  model_id: string;
  sku?: string;
  location_id?: string;
  parameters: ModelParameter[];
  created_at: string;
  performance_metrics?: {
    accuracy: number;
    trend: 'improving' | 'stable' | 'declining';
    trained_at: string;
    mape?: number;
    mae?: number;
    rmse?: number;
  };
}

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

const ForecastAnalysisTab = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [modelParameters, setModelParameters] = useState<ModelParameter[]>([]);
  const [savedModels, setSavedModels] = useState<SavedModelConfig[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState<string>("95");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSku, setSelectedSku] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
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
        sku: "SKU-001",
        location_id: "LOC-NY",
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
        sku: "SKU-002",
        location_id: "LOC-LA",
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

  const filteredModels = savedModels.filter(model => {
    const searchLower = searchTerm.toLowerCase();
    const skuMatch = selectedSku === "all" || model.sku === selectedSku;
    const locationMatch = selectedLocation === "all" || model.location_id === selectedLocation;
    return (
      (model.model_id.toLowerCase().includes(searchLower) ||
       (model.sku?.toLowerCase().includes(searchLower)) ||
       (model.location_id?.toLowerCase().includes(searchLower))) &&
      skuMatch && locationMatch
    );
  });

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
    if (!selectedSku || !selectedLocation) {
      toast.error('Please select both SKU and Location before saving');
      return;
    }
    toast.success('Model configuration saved successfully');
  };

  const handleDeleteModel = async (modelId: string) => {
    setSavedModels(prev => prev.filter(model => model.id !== modelId));
    toast.success('Model configuration deleted successfully');
  };

  const metrics = calculateMetrics(sampleData);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelRecommendations 
          models={savedModels} 
          onSelectModel={(modelId) => {
            setSelectedModels([modelId]);
            const model = savedModels.find(m => m.model_id === modelId);
            if (model) {
              setModelParameters(model.parameters);
              setSelectedSku(model.sku || "all");
              setSelectedLocation(model.location_id || "all");
            }
          }}
        />

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Model Selection & Comparison</h3>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px]"
                />
                <Select value={selectedSku} onValueChange={setSelectedSku}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select SKU" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All SKUs</SelectItem>
                    {Array.from(new Set(savedModels.map(m => m.sku))).filter(Boolean).map(sku => (
                      <SelectItem key={sku} value={sku!}>{sku}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {Array.from(new Set(savedModels.map(m => m.location_id))).filter(Boolean).map(loc => (
                      <SelectItem key={loc} value={loc!}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <ModelSelectionCard
                  selectedModel={selectedModels[0] || ""}
                  onModelChange={handleModelChange}
                  onParametersChange={handleParametersChange}
                />
              </div>

              {selectedModels.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Selected Models for Comparison</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedModels.map(modelId => {
                      const model = savedModels.find(m => m.model_id === modelId);
                      return model && (
                        <div 
                          key={model.id} 
                          className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2"
                        >
                          <span className="text-sm">{model.model_id}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedModels(prev => prev.filter(id => id !== modelId))}
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
                      onClick={() => setSelectedModels([])}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <ScrollArea className="h-[400px] mt-4">
              <div className="space-y-2">
                {filteredModels.map((model) => (
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
                              setSelectedModels(prev => prev.filter(id => id !== model.model_id));
                            } else if (selectedModels.length < 3) {
                              setSelectedModels(prev => [...prev, model.model_id]);
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
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
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
      </div>

      <ForecastMetricsCards metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnomalyDetection data={sampleData} />
        <ErrorDistribution data={sampleData} />
      </div>

      <PatternAnalysisCard data={sampleData} />

      <TeamCollaboration />
    </div>
  );
};

export default ForecastAnalysisTab;
