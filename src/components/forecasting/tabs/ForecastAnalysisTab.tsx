
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ValidationResult, type CrossValidationResult, performCrossValidation, validateForecast } from "@/utils/forecasting/statistics";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const [validationSelectedTab, setValidationSelectedTab] = useState("overview");
  const [crossValidationResults, setCrossValidationResults] = useState<CrossValidationResult>(
    performCrossValidation(sampleData.map(d => d.actual as number).filter(Boolean))
  );
  const [validationResults, setValidationResults] = useState<ValidationResult>(
    validateForecast(
      sampleData.filter(d => d.actual !== null).map(d => d.actual as number),
      sampleData.filter(d => d.actual !== null).map(d => d.forecast as number)
    )
  );

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

  // Generate sample actual vs predicted data for validation visualization
  const sampleValidationData = Array.from({ length: 24 }, (_, i) => {
    const actual = 100 + Math.random() * 30 + (i % 12) * 8;
    const predicted = actual * (1 + (Math.random() * 0.2 - 0.1));
    const error = ((predicted - actual) / actual) * 100;
    return {
      period: `P${i + 1}`,
      actual: Math.round(actual),
      predicted: Math.round(predicted),
      error: parseFloat(error.toFixed(1))
    };
  });

  // Generate residual analysis data
  const residualData = sampleValidationData.map(item => ({
    period: item.period,
    residual: item.predicted - item.actual,
    percentError: item.error
  }));

  // Summary metrics for different time horizons
  const horizonMetrics = [
    { horizon: "Short-term (1-4 weeks)", mape: 5.2, mae: 8.4, rmse: 10.2, bias: -1.2 },
    { horizon: "Medium-term (5-12 weeks)", mape: 8.7, mae: 12.3, rmse: 14.8, bias: 2.1 },
    { horizon: "Long-term (13+ weeks)", mape: 15.3, mae: 18.9, rmse: 22.5, bias: 3.8 }
  ];

  // Statistical test details
  const statisticalTests = [
    {
      name: "Bias Test",
      result: validationResults.biasTest ? "Pass" : "Fail",
      description: "Determines if forecasts consistently over or under-predict",
      statistic: "0.82",
      pValue: "0.39"
    },
    {
      name: "Residual Normality",
      result: validationResults.residualNormality ? "Pass" : "Fail",
      description: "Tests if forecast errors follow normal distribution",
      statistic: "1.43",
      pValue: "0.15"
    },
    {
      name: "Heteroskedasticity Test",
      result: validationResults.heteroskedasticityTest ? "Pass" : "Fail",
      description: "Checks if forecast variance is consistent across values",
      statistic: "1.91",
      pValue: "0.08"
    },
    {
      name: "Autocorrelation Test",
      result: "Pass",
      description: "Evaluates if errors are independent over time",
      statistic: "1.22",
      pValue: "0.27"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold">Model Selection & Comparison</h3>
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

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Forecast Analysis</h3>
              <p className="text-xs text-muted-foreground">
                Visual analysis of forecasted values with confidence intervals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Confidence Level:</span>
              <Select
                value={confidenceLevel}
                onValueChange={setConfidenceLevel}
              >
                <SelectTrigger className="w-[100px] text-xs h-8">
                  <SelectValue placeholder="95%" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90" className="text-xs">90%</SelectItem>
                  <SelectItem value="95" className="text-xs">95%</SelectItem>
                  <SelectItem value="99" className="text-xs">99%</SelectItem>
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

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Model Validation</h3>
        <Tabs defaultValue={validationSelectedTab} onValueChange={setValidationSelectedTab} className="w-full">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="text-xs py-1.5">Validation Overview</TabsTrigger>
            <TabsTrigger value="detailed" className="text-xs py-1.5">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="statistical" className="text-xs py-1.5">Statistical Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Forecast vs Actual</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sampleValidationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#0ea5e9" 
                      name="Actual" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#8b5cf6" 
                      name="Forecast" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Cross Validation Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-medium">Training Set</h4>
                  <p className="text-xl font-bold">{(100 - crossValidationResults.trainMetrics.mape).toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                  <div className="text-xs space-y-1">
                    <p>MAPE: {crossValidationResults.trainMetrics.mape.toFixed(2)}%</p>
                    <p>MAE: {crossValidationResults.trainMetrics.mae.toFixed(2)}</p>
                    <p>RMSE: {crossValidationResults.trainMetrics.rmse.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-medium">Test Set</h4>
                  <p className="text-xl font-bold">{(100 - crossValidationResults.testMetrics.mape).toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                  <div className="text-xs space-y-1">
                    <p>MAPE: {crossValidationResults.testMetrics.mape.toFixed(2)}%</p>
                    <p>MAE: {crossValidationResults.testMetrics.mae.toFixed(2)}</p>
                    <p>RMSE: {crossValidationResults.testMetrics.rmse.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-medium">Validation Set</h4>
                  <p className="text-xl font-bold">{(100 - crossValidationResults.validationMetrics.mape).toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                  <div className="text-xs space-y-1">
                    <p>MAPE: {crossValidationResults.validationMetrics.mape.toFixed(2)}%</p>
                    <p>MAE: {crossValidationResults.validationMetrics.mae.toFixed(2)}</p>
                    <p>RMSE: {crossValidationResults.validationMetrics.rmse.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Forecast Accuracy By Time Horizon</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Time Horizon</TableHead>
                    <TableHead className="text-xs">MAPE (%)</TableHead>
                    <TableHead className="text-xs">MAE</TableHead>
                    <TableHead className="text-xs">RMSE</TableHead>
                    <TableHead className="text-xs">Bias</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {horizonMetrics.map((metric) => (
                    <TableRow key={metric.horizon}>
                      <TableCell className="text-xs font-medium">{metric.horizon}</TableCell>
                      <TableCell className="text-xs">{metric.mape.toFixed(1)}</TableCell>
                      <TableCell className="text-xs">{metric.mae.toFixed(1)}</TableCell>
                      <TableCell className="text-xs">{metric.rmse.toFixed(1)}</TableCell>
                      <TableCell className="text-xs">{metric.bias.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Forecast Error Analysis</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={residualData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={0} stroke="#000" />
                    <Bar dataKey="percentError" name="Error (%)" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="statistical" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Statistical Tests</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Test</TableHead>
                      <TableHead className="text-xs">Result</TableHead>
                      <TableHead className="text-xs">Statistic</TableHead>
                      <TableHead className="text-xs">p-Value</TableHead>
                      <TableHead className="text-xs">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statisticalTests.map((test) => (
                      <TableRow key={test.name}>
                        <TableCell className="text-xs font-medium">{test.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            test.result === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {test.result}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs">{test.statistic}</TableCell>
                        <TableCell className="text-xs">{test.pValue}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{test.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Residual Analysis</h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={residualData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={0} stroke="#000" />
                    <Line 
                      type="monotone" 
                      dataKey="residual" 
                      stroke="#10b981" 
                      name="Residual" 
                      dot={{ r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>Residual analysis is used to examine how well a model fits the data. Ideally, residuals should:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Be randomly distributed around zero</li>
                  <li>Show no pattern or trend over time</li>
                  <li>Have consistent variance (spread) across all values</li>
                  <li>Follow normal distribution</li>
                </ul>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>

      <PatternAnalysisCard data={sampleData} />

      <TeamCollaboration />
    </div>
  );
};

export default ForecastAnalysisTab;
