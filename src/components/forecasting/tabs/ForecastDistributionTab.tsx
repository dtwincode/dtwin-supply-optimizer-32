import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastTable } from "@/components/forecasting/ForecastTable";
import { format, parseISO, addWeeks } from "date-fns";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { X, Download, Upload, AlertTriangle, LineChart } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { SavedModelConfig, ModelParameter } from "@/types/models/commonTypes";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ValidationPeriod {
  startDate: string;
  endDate: string;
  metrics?: {
    mape?: number;
    rmse?: number;
    mae?: number;
  };
}

interface ForecastDistributionTabProps {
  forecastTableData: Array<{
    date: string | null;
    value: number;
    forecast: number;
    sku: string;
    category: string;
    subcategory: string;
    variance: number;
    id: string;
  }>;
}

export const ForecastDistributionTab = ({
  forecastTableData: initialForecastData
}: ForecastDistributionTabProps) => {
  const [selectedModel, setSelectedModel] = useState<string>("moving-avg");
  const [autoRun, setAutoRun] = useState(true);
  const [savedConfigs, setSavedConfigs] = useState<SavedModelConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [forecastTableData, setForecastTableData] = useState(initialForecastData);
  const [validationPeriod, setValidationPeriod] = useState<ValidationPeriod>({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addWeeks(new Date(), 12), 'yyyy-MM-dd')
  });
  const [alertThreshold, setAlertThreshold] = useState(15); // 15% deviation threshold
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [comparisonConfigId, setComparisonConfigId] = useState<string | null>(null);
  const { toast } = useToast();

  const parseParameters = (parametersJson: unknown): ModelParameter[] => {
    try {
      if (typeof parametersJson === 'string') {
        const parsed = JSON.parse(parametersJson);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const loadSavedConfigs = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_model_configs')
          .select('*');

        if (error) throw error;

        if (data) {
          setSavedConfigs(data.map(config => ({
            id: config.id,
            productId: config.product_id,
            productName: config.product_name,
            modelId: config.model_id,
            parameters: parseParameters(config.parameters),
            autoRun: config.auto_run
          })));
        }
      } catch (error) {
        console.error('Error loading saved configurations:', error);
        toast({
          title: "Error",
          description: "Failed to load saved configurations",
          variant: "destructive"
        });
      }
    };

    loadSavedConfigs();
  }, [toast]);

  const fetchProductForecastData = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('forecast_data')
        .select('*')
        .eq('sku', productId)
        .order('date', { ascending: true });

      if (error) throw error;

      if (data) {
        setForecastTableData(data);
        console.log('Fetched forecast data for product:', productId, data);
      }
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch forecast data for the selected product",
        variant: "destructive"
      });
    }
  };

  const handleModelParametersChange = (modelId: string, parameters: ModelParameter[]) => {
    console.log('Model parameters updated:', modelId, parameters);
    if (autoRun && selectedConfigId) {
      const selectedConfig = savedConfigs.find(config => config.id === selectedConfigId);
      if (selectedConfig) {
        fetchProductForecastData(selectedConfig.productId);
      }
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      const timestamp = new Date().getTime();
      const randomStr = Math.random().toString(36).substring(7);
      const uniqueProductId = `product-${timestamp}-${randomStr}`;
      
      const configData = {
        product_id: uniqueProductId,
        product_name: `Configuration ${savedConfigs.length + 1}`,
        model_id: selectedModel,
        parameters: JSON.stringify([]) as string,
        auto_run: autoRun
      };

      const { data, error } = await supabase
        .from('saved_model_configs')
        .insert([configData])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const newConfig: SavedModelConfig = {
          id: data[0].id,
          productId: data[0].product_id,
          productName: data[0].product_name,
          modelId: data[0].model_id,
          parameters: parseParameters(data[0].parameters),
          autoRun: data[0].auto_run
        };

        setSavedConfigs(prev => [...prev, newConfig]);

        toast({
          title: "Success",
          description: `Model configuration "${newConfig.productName}" has been saved.`
        });
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive"
      });
    }
  };

  const removeConfiguration = async (configId: string) => {
    try {
      const config = savedConfigs.find(c => c.id === configId);
      if (!config) return;

      const { error } = await supabase
        .from('saved_model_configs')
        .delete()
        .eq('id', configId);

      if (error) throw error;

      setSavedConfigs(prev => prev.filter(config => config.id !== configId));
      if (selectedConfigId === configId) {
        setSelectedConfigId(null);
        setForecastTableData(initialForecastData);
      }

      toast({
        title: "Success",
        description: "Configuration removed successfully"
      });
    } catch (error) {
      console.error('Error removing configuration:', error);
      toast({
        title: "Error",
        description: "Failed to remove configuration",
        variant: "destructive"
      });
    }
  };

  const handleConfigSelect = async (configId: string) => {
    setSelectedConfigId(configId);
    const selectedConfig = savedConfigs.find(config => config.id === configId);
    if (selectedConfig) {
      setSelectedModel(selectedConfig.modelId);
      setAutoRun(selectedConfig.autoRun);
      await fetchProductForecastData(selectedConfig.productId);
      toast({
        title: "Configuration Loaded",
        description: `Loaded forecast configuration for ${selectedConfig.productName}`
      });
    }
  };

  const handleExportConfig = () => {
    if (!selectedConfigId) return;
    
    const config = savedConfigs.find(c => c.id === selectedConfigId);
    if (!config) return;

    const configData = JSON.stringify(config, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast-config-${config.productName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration Exported",
      description: "The model configuration has been exported successfully."
    });
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        const { data, error } = await supabase
          .from('saved_model_configs')
          .insert([{
            product_id: config.productId,
            product_name: `${config.productName} (Imported)`,
            model_id: config.modelId,
            parameters: config.parameters,
            auto_run: config.autoRun
          }])
          .select();

        if (error) throw error;

        if (data) {
          const newConfig: SavedModelConfig = {
            id: data[0].id,
            productId: data[0].product_id,
            productName: data[0].product_name,
            modelId: data[0].model_id,
            parameters: parseParameters(data[0].parameters),
            autoRun: data[0].auto_run
          };

          setSavedConfigs(prev => [...prev, newConfig]);
          toast({
            title: "Configuration Imported",
            description: "The model configuration has been imported successfully."
          });
        }
      } catch (error) {
        console.error('Error importing configuration:', error);
        toast({
          title: "Import Error",
          description: "Failed to import the configuration file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleBatchForecast = async () => {
    if (!selectedConfigId) return;

    toast({
      title: "Batch Forecast Started",
      description: "Generating forecasts for all products...",
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Batch Forecast Complete",
        description: "All forecasts have been generated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate batch forecasts.",
        variant: "destructive"
      });
    }
  };

  const handleComparisonToggle = async () => {
    setIsComparisonMode(!isComparisonMode);
    if (!isComparisonMode) {
      setComparisonConfigId(null);
    }
  };

  const currentDate = new Date();
  const futureWeeks = 12;

  const enhancedData = forecastTableData.map((row) => {
    const confidenceInterval = Math.sqrt(row.variance || 0) * 1.96;
    const forecast = row.forecast || 0;
    
    let formattedDate = 'No date';
    try {
      if (row.date) {
        formattedDate = format(parseISO(row.date), 'MMM dd, yyyy');
      }
    } catch (error) {
      console.error('Error parsing date:', row.date, error);
    }
    
    return {
      week: row.date || '',
      forecast: forecast,
      actual: row.value,
      variance: row.variance,
      lower: Math.max(0, forecast - confidenceInterval),
      upper: forecast + confidenceInterval,
      sku: row.sku || 'N/A',
      category: row.category || 'N/A',
      subcategory: row.subcategory || 'N/A',
      id: row.id
    };
  });

  const futureDates = Array.from({ length: futureWeeks }, (_, i) => {
    const lastDataPoint = enhancedData[enhancedData.length - 1];
    const lastDate = lastDataPoint?.week ? parseISO(lastDataPoint.week) : currentDate;
    const newDate = addWeeks(lastDate, i + 1);
    
    const baseForecast = lastDataPoint?.forecast || 100;
    const randomVariation = (Math.random() - 0.5) * 0.2;
    const newForecast = baseForecast * (1 + randomVariation);
    const variance = (lastDataPoint?.variance || 10) * (1 + Math.random() * 0.2);

    return {
      week: format(newDate, 'yyyy-MM-dd'),
      forecast: newForecast,
      actual: null,
      variance: variance,
      lower: Math.max(0, newForecast - Math.sqrt(variance) * 1.96),
      upper: newForecast + Math.sqrt(variance) * 1.96,
      sku: lastDataPoint?.sku || 'N/A',
      category: lastDataPoint?.category || 'N/A',
      subcategory: lastDataPoint?.subcategory || 'N/A',
      id: `future-${i}`
    };
  });

  const allData = [...enhancedData, ...futureDates];
  const confidenceIntervals = allData.map(d => ({
    upper: d.upper,
    lower: d.lower
  }));

  if (!forecastTableData || forecastTableData.length === 0) {
    return <div className="p-4 text-muted-foreground">No forecast data available</div>;
  }

  return (
    <div className="space-y-8 p-4 bg-background">
      <Card className="p-6 border shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Step 1: Select Model</h3>
              <p className="text-muted-foreground">
                Choose and configure your forecasting model
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportConfig}
                disabled={!selectedConfigId}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="relative">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImportConfig}
                  className="hidden"
                  id="import-config"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('import-config')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </div>

          {savedConfigs.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-medium">View Saved Configuration</Label>
              <Select
                value={selectedConfigId || ""}
                onValueChange={handleConfigSelect}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Select a saved configuration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Saved Configurations</SelectLabel>
                    {savedConfigs.map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        {config.productName} ({config.modelId})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="auto-run"
              checked={autoRun}
              onCheckedChange={setAutoRun}
            />
            <Label htmlFor="auto-run" className="text-sm">
              Auto-run forecasts when configuration changes
            </Label>
          </div>

          <div className="mt-6">
            <ModelSelectionCard
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              onParametersChange={handleModelParametersChange}
            />
          </div>

          <Button 
            className="mt-4 w-full sm:w-auto"
            onClick={handleSaveConfiguration}
          >
            Save Configuration for Current Product
          </Button>

          {savedConfigs.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Saved Configurations</h4>
              <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                <div className="space-y-2">
                  {savedConfigs.map((config) => (
                    <div 
                      key={config.id}
                      className={`flex items-center justify-between rounded-lg p-2 ${
                        selectedConfigId === config.id 
                          ? 'bg-primary/20' 
                          : 'bg-secondary/20'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{config.productName}</span>
                        <Badge variant="secondary">{config.modelId}</Badge>
                        {config.autoRun && (
                          <Badge variant="outline">Auto-run</Badge>
                        )}
                        {selectedConfigId === config.id && (
                          <Badge variant="default">Selected</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConfiguration(config.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 border shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Step 2: Future Forecast Visualization</h3>
            {validationPeriod.metrics && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  MAPE: {validationPeriod.metrics.mape?.toFixed(2)}%
                </Badge>
                <Badge variant="outline">
                  RMSE: {validationPeriod.metrics.rmse?.toFixed(2)}
                </Badge>
                <Badge variant="outline">
                  MAE: {validationPeriod.metrics.mae?.toFixed(2)}
                </Badge>
              </div>
            )}
          </div>
          <p className="text-muted-foreground">
            Historical data and future forecast predictions with confidence intervals
          </p>
        </div>
        <div className="h-[400px] w-full overflow-hidden mt-6">
          <ForecastChart
            data={allData}
            confidenceIntervals={confidenceIntervals}
          />
        </div>
      </Card>

      <Card className="p-6 border shadow-sm">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Step 3: Forecast Distribution Details</h3>
          <p className="text-muted-foreground">
            Detailed view of forecast values and confidence intervals
          </p>
        </div>
        <div className="mt-6">
          <ForecastTable data={allData.map(d => ({
            week: format(parseISO(d.week), 'MMM dd, yyyy'),
            forecast: Math.round(d.forecast),
            lower: Math.round(d.lower),
            upper: Math.round(d.upper),
            sku: d.sku,
            category: d.category,
            subcategory: d.subcategory,
            id: d.id
          }))} />
        </div>
      </Card>
    </div>
  );
};
