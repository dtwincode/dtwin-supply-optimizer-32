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
import { Line, Area, ResponsiveContainer, LineChart, AreaChart, XAxis, YAxis, Tooltip } from "recharts";

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

const sampleData: ForecastDataPoint[] = Array.from({ length: 24 }, (_, i) => {
  const baseValue = 1000;
  const trend = i * 10;
  const seasonality = Math.sin(i * Math.PI / 6) * 200; // 12-month seasonality
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

const PatternAnalysisCard = ({ data }: { data: ForecastDataPoint[] }) => {
  const analyzePatterns = () => {
    const forecastValues = data
      .map(d => typeof d.forecast === 'number' ? d.forecast : 0)
      .filter(f => !isNaN(f));
    
    const actualValues = data
      .map(d => typeof d.actual === 'number' ? d.actual : 0)
      .filter(a => !isNaN(a));
    
    const trend = forecastValues.length > 1 ? 
      ((forecastValues[forecastValues.length - 1] - forecastValues[0]) / forecastValues[0]) * 100 : 0;
    
    const meanActual = actualValues.length > 0 ? 
      actualValues.reduce((a, b) => a + b, 0) / actualValues.length : 0;
    
    const seasonality = actualValues.length >= 12 ? 
      Math.abs(Math.max(...actualValues) - Math.min(...actualValues)) / meanActual : 0;
    
    const squaredDiffs = actualValues.map(val => Math.pow(val - meanActual, 2));
    const variance = squaredDiffs.length > 1 ? 
      squaredDiffs.reduce((a, b) => a + b, 0) / (actualValues.length - 1) : 0;
    const volatility = Math.sqrt(variance);

    return {
      trend,
      seasonality,
      volatility
    };
  };

  const patterns = analyzePatterns();

  const trendData = data
    .map((d, index) => ({
      index,
      value: typeof d.forecast === 'number' ? d.forecast : 0
    }))
    .filter(d => !isNaN(d.value));

  const seasonalityData = data
    .map((d, index) => ({
      index,
      value: typeof d.actual === 'number' ? d.actual : 0
    }))
    .filter(d => !isNaN(d.value));

  const validActuals = data
    .map(item => typeof item.actual === 'number' ? item.actual : 0)
    .filter(val => !isNaN(val));
  
  const average = validActuals.length > 0 ? 
    validActuals.reduce((sum, val) => sum + val, 0) / validActuals.length : 0;

  const volatilityData = data
    .map((d, index) => ({
      index,
      value: typeof d.actual === 'number' ? d.actual : 0,
      average
    }))
    .filter(d => !isNaN(d.value));

  const MiniChart = ({ data, color }: { data: any[], color: string }) => (
    <div className="h-[60px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis hide={true} />
          <YAxis hide={true} />
          <Tooltip
            formatter={(value: any) => [Math.round(value), "Units"]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px'
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const VolatilityChart = ({ data, color }: { data: any[], color: string }) => (
    <div className="h-[60px] w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <XAxis hide={true} />
          <YAxis hide={true} />
          <Tooltip
            formatter={(value: any) => [Math.round(value), "Units"]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px'
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="average"
            stroke={color}
            strokeDasharray="3 3"
            strokeWidth={1}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pattern Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Based on {data.length} data points
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {patterns.trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">Trend Analysis</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {Math.abs(patterns.trend).toFixed(1)}% {patterns.trend >= 0 ? "Upward" : "Downward"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Overall directional movement in the forecast over time
              </p>
              <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Key Insights:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Growth rate: {(patterns.trend / data.length).toFixed(2)}% per period</li>
                  <li>Momentum: {Math.abs(patterns.trend) > 5 ? 'Strong' : 'Moderate'}</li>
                  <li>Consistency: {Math.abs(patterns.trend) < 2 ? 'Stable' : 'Variable'}</li>
                </ul>
              </div>
            </div>
            <MiniChart data={trendData} color={patterns.trend >= 0 ? "#10B981" : "#EF4444"} />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Seasonality</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {(patterns.seasonality * 100).toFixed(1)}% Variation
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cyclical patterns and recurring demand fluctuations
              </p>
              <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Pattern Strength:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Peak amplitude: {(patterns.seasonality * 200).toFixed(1)}% from mean</li>
                  <li>Pattern type: {patterns.seasonality > 0.2 ? 'Strong seasonal' : 'Weak seasonal'}</li>
                  <li>Cycle length: {Math.round(data.length / 4)} periods</li>
                </ul>
              </div>
            </div>
            <MiniChart data={seasonalityData} color="#3B82F6" />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Volatility</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {patterns.volatility.toFixed(1)} Units
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Measure of demand variability and uncertainty
              </p>
              <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Risk Assessment:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Coefficient of variation: {(patterns.volatility / (data.reduce((sum, d) => sum + (d.actual || 0), 0) / data.length) * 100).toFixed(1)}%</li>
                  <li>Stability: {patterns.volatility < 10 ? 'High' : patterns.volatility < 30 ? 'Medium' : 'Low'}</li>
                  <li>Forecast confidence: {100 - (patterns.volatility * 2).toFixed(1)}%</li>
                </ul>
              </div>
            </div>
            <VolatilityChart data={volatilityData} color="#EAB308" />
          </div>
        </div>
      </div>
    </Card>
  );
};

const calculateMetrics = (data: ForecastDataPoint[]) => {
  const actualValues = data.filter(d => d.actual !== null).map(d => d.actual!);
  const forecastValues = data.filter(d => d.actual !== null && d.forecast !== null).map(d => d.forecast!);
  
  if (actualValues.length === 0) {
    return {
      mape: 0,
      mae: 0,
      rmse: 0
    };
  }

  const mape = actualValues.reduce((sum, actual, i) => {
    if (typeof actual === 'number' && typeof forecastValues[i] === 'number') {
      return sum + Math.abs((actual - forecastValues[i]) / actual);
    }
    return sum;
  }, 0) / actualValues.length * 100;

  const mae = actualValues.reduce((sum, actual, i) => {
    if (typeof actual === 'number' && typeof forecastValues[i] === 'number') {
      return sum + Math.abs(actual - forecastValues[i]);
    }
    return sum;
  }, 0) / actualValues.length;

  const rmse = Math.sqrt(
    actualValues.reduce((sum, actual, i) => {
      if (typeof actual === 'number' && typeof forecastValues[i] === 'number') {
        return sum + Math.pow(actual - forecastValues[i], 2);
      }
      return sum;
    }, 0) / actualValues.length
  );

  return {
    mape,
    mae,
    rmse
  };
};

const ForecastAnalysisTab = () => {
  const [selectedModel, setSelectedModel] = useState("exp-smoothing");
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
    setSelectedModel(modelId);
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
