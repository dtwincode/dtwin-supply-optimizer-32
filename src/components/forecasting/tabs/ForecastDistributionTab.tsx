import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastTable } from "@/components/forecasting/ForecastTable";
import { format, parseISO } from "date-fns";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, Info, X, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { SavedModelConfig, ModelParameter } from "@/types/models/commonTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [alertThreshold, setAlertThreshold] = useState(15);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedConfigs();
  }, []);

  const loadSavedConfigs = async () => {
    const { data, error } = await supabase
      .from('saved_model_configs')
      .select('*');

    if (error) {
      console.error('Error loading configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load saved configurations",
        variant: "destructive"
      });
      return;
    }

    if (data) {
      const configs: SavedModelConfig[] = data.map(config => ({
        id: config.id,
        productId: config.product_id,
        productName: config.product_name,
        modelId: config.model_id,
        parameters: [],
        autoRun: config.auto_run
      }));
      setSavedConfigs(configs);
    }
  };

  const handleDeleteConfiguration = async (configId: string) => {
    try {
      const { error } = await supabase
        .from('saved_model_configs')
        .delete()
        .eq('id', configId);

      if (error) throw error;

      setSavedConfigs(prev => prev.filter(config => config.id !== configId));
      
      if (selectedConfigId === configId) {
        setSelectedConfigId(null);
      }

      toast({
        title: "Success",
        description: "Configuration deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast({
        title: "Error",
        description: "Failed to delete configuration",
        variant: "destructive"
      });
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
        parameters: JSON.stringify([]),
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
          parameters: [],
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
            parameters: [],
            autoRun: data[0].auto_run
          };

          setSavedConfigs(prev => [...prev, newConfig]);
          toast({
            title: "Success",
            description: "Configuration imported successfully"
          });
        }
      } catch (error) {
        console.error('Error importing configuration:', error);
        toast({
          title: "Error",
          description: "Failed to import configuration",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateForecast = async () => {
    if (!selectedConfigId) {
      toast({
        title: "Warning",
        description: "Please select a configuration first",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Generating Forecast",
      description: "Please wait while we generate your forecast..."
    });

    try {
      // Simulate forecast generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Forecast generated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate forecast",
        variant: "destructive"
      });
    }
  };

  // Calculate confidence intervals
  const allData = forecastTableData.map(row => {
    const variance = row.variance || 0;
    const forecast = row.forecast || 0;
    const confidenceInterval = Math.sqrt(variance) * 1.96;
    
    return {
      week: row.date || '',
      forecast: forecast,
      actual: row.value,
      variance: variance,
      lower: Math.max(0, forecast - confidenceInterval),
      upper: forecast + confidenceInterval,
      sku: row.sku,
      category: row.category,
      subcategory: row.subcategory,
      id: row.id
    };
  });

  const confidenceIntervals = allData.map(d => ({
    upper: d.upper,
    lower: d.lower
  }));

  // UI Rendering
  return (
    <div className="space-y-6 p-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Model Configuration</h3>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Saved Configurations</Label>
              <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Configurations
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Saved Model Configurations</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {savedConfigs.map((config) => (
                        <Card
                          key={config.id}
                          className={`p-4 ${
                            selectedConfigId === config.id ? 'border-primary' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{config.productName}</h4>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                      <h5 className="font-medium">Configuration Details</h5>
                                      <div className="text-sm">
                                        <p><span className="font-medium">Model:</span> {config.modelId}</p>
                                        <p><span className="font-medium">Auto-run:</span> {config.autoRun ? 'Yes' : 'No'}</p>
                                        <p><span className="font-medium">ID:</span> {config.productId}</p>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Model: {config.modelId}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedConfigId(config.id);
                                  setSelectedModel(config.modelId);
                                  setAutoRun(config.autoRun);
                                  setIsConfigDialogOpen(false);
                                }}
                              >
                                Select
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteConfiguration(config.id)}
                                className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {savedConfigs.length === 0 && (
                        <p className="text-muted-foreground text-sm p-2">No saved configurations</p>
                      )}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            {selectedConfigId && (
              <div className="text-sm text-muted-foreground">
                Selected: {savedConfigs.find(c => c.id === selectedConfigId)?.productName}
              </div>
            )}
          </div>

          <ModelSelectionCard
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onParametersChange={() => {}}
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-run"
              checked={autoRun}
              onCheckedChange={setAutoRun}
            />
            <Label htmlFor="auto-run">Auto-run forecasts</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Label>Alert Threshold (%)</Label>
            <Input
              type="number"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="w-24"
            />
          </div>

          <Button 
            className="w-full"
            onClick={handleSaveConfiguration}
          >
            Save Configuration
          </Button>

          <Button 
            className="w-full"
            variant="secondary"
            onClick={handleGenerateForecast}
            disabled={!selectedConfigId}
          >
            Generate Forecast
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Forecast Visualization</h3>
          <div className="h-[400px]">
            <ForecastChart
              data={allData}
              confidenceIntervals={confidenceIntervals}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Forecast Details</h3>
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
