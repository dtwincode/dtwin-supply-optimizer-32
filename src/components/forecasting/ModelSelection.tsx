import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Code2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModelConfig {
  id: string;
  model_name: string;
  is_enabled: boolean | null;
  model_category: string;
  complexity: string;
  description: string | null;
  use_case: string | null;
}

export const ModelSelection = () => {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('forecast_model_config')
        .select('*')
        .order('model_category', { ascending: false })
        .order('model_name', { ascending: true });

      if (error) throw error;
      setModels(data || []);
    } catch (error: any) {
      console.error('Error loading models:', error);
      toast({
        title: "Failed to load models",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleModel = async (modelId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('forecast_model_config')
        .update({ is_enabled: !currentState, updated_at: new Date().toISOString() })
        .eq('id', modelId);

      if (error) throw error;

      setModels(models.map(m => 
        m.id === modelId ? { ...m, is_enabled: !currentState } : m
      ));

      toast({
        title: !currentState ? "Model Enabled" : "Model Disabled",
        description: `This model will ${!currentState ? 'be included in' : 'be excluded from'} future evaluations.`
      });
    } catch (error: any) {
      console.error('Error toggling model:', error);
      toast({
        title: "Failed to update model",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'LOW': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HIGH': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const traditionalModels = models.filter(m => m.model_category === 'TRADITIONAL');
  const aiModels = models.filter(m => m.model_category === 'AI_POWERED');

  const enabledCount = models.filter(m => m.is_enabled).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Forecasting Model Configuration</CardTitle>
              <CardDescription>
                Enable or disable models for evaluation. All enabled models will be tested during model evaluation.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {enabledCount} / {models.length} Active
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Models Tabs */}
      <Tabs defaultValue="traditional" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="traditional" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Traditional Models ({traditionalModels.length})
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI-Powered Models ({aiModels.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traditional" className="space-y-3">
          {traditionalModels.map((model) => (
            <Card key={model.id} className={model.is_enabled ? 'border-primary/50' : 'opacity-60'}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{model.model_name}</h3>
                      <Badge className={getComplexityColor(model.complexity)}>
                        {model.complexity}
                      </Badge>
                      {model.is_enabled && (
                        <Badge variant="default">Enabled</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{model.description || 'No description'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">Best for:</span>
                      <span>{model.use_case || 'General use'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={model.is_enabled ?? false}
                      onCheckedChange={() => toggleModel(model.id, model.is_enabled ?? false)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ai" className="space-y-3">
          {aiModels.map((model) => (
            <Card key={model.id} className={model.is_enabled ? 'border-primary/50 bg-primary/5' : 'opacity-60'}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{model.model_name}</h3>
                      <Badge className={getComplexityColor(model.complexity)}>
                        {model.complexity}
                      </Badge>
                      {model.is_enabled && (
                        <Badge variant="default">Enabled</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{model.description || 'No description'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">Best for:</span>
                      <span>{model.use_case || 'General use'}</span>
                    </div>
                    <div className="text-xs text-primary">
                      ⚡ Powered by Lovable AI (Gemini 2.5 Flash)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={model.is_enabled ?? false}
                      onCheckedChange={() => toggleModel(model.id, model.is_enabled ?? false)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="border-muted bg-muted/30">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="font-medium">How Model Selection Works:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Enable the models you want to test during evaluation</li>
              <li>Go to <strong>Model Evaluation</strong> tab and click "Run Model Evaluation"</li>
              <li>System tests all enabled models on historical data</li>
              <li>Best model is automatically selected for each product-location pair based on SMAPE</li>
              <li>Disable models to exclude them from future evaluations (reduces computation time)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
