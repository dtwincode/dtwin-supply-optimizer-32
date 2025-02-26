import { Card } from "@/components/ui/card";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { AnomalyDetection } from "@/components/forecasting/components/AnomalyDetection";
import { ErrorDistribution } from "@/components/forecasting/components/ErrorDistribution";
import { PatternAnalysisCard } from "@/components/forecasting/components/PatternAnalysisCard";
import { TeamCollaboration } from "@/components/forecasting/components/TeamCollaboration";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ModelSearch } from "@/components/forecasting/components/analysis/ModelSearch";
import { ModelList } from "@/components/forecasting/components/analysis/ModelList";
import { SelectedModelsList } from "@/components/forecasting/components/analysis/SelectedModelsList";
import { ForecastDataPoint } from "@/types/forecasting";
import { ModelParameter } from "@/types/models/commonTypes";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const skus = Array.from(new Set(savedModels.map(m => m.sku))).filter(Boolean) as string[];
  const locations = Array.from(new Set(savedModels.map(m => m.location_id))).filter(Boolean) as string[];

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
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Model Selection & Comparison</h3>
            <ModelSearch
              searchTerm={searchTerm}
              selectedSku={selectedSku}
              selectedLocation={selectedLocation}
              onSearchChange={setSearchTerm}
              onSkuChange={setSelectedSku}
              onLocationChange={setSelectedLocation}
              skus={skus}
              locations={locations}
            />
          </div>

          <div className="space-y-4">
            <ModelSelectionCard
              selectedModel={selectedModels[0] || ""}
              onModelChange={handleModelChange}
              onParametersChange={handleParametersChange}
            />

            <SelectedModelsList
              selectedModels={selectedModels}
              models={savedModels}
              onRemoveModel={(modelId) => setSelectedModels(prev => prev.filter(id => id !== modelId))}
              onClearAll={() => setSelectedModels([])}
            />
          </div>
          
          <ModelList
            models={filteredModels}
            selectedModels={selectedModels}
            expandedModel={expandedModel}
            onModelSelect={handleModelChange}
            onExpandModel={setExpandedModel}
            onDeleteModel={handleDeleteModel}
          />
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

      <ForecastMetricsCards metrics={metrics} />
      
      <AnomalyDetection data={sampleData} />
      
      <ErrorDistribution data={sampleData} />

      <PatternAnalysisCard data={sampleData} />

      <TeamCollaboration />
    </div>
  );
};

export default ForecastAnalysisTab;
