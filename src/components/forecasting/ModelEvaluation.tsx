import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlayCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ModelResult {
  product_id: string;
  location_id: string;
  model_name: string;
  mae: number | null;
  rmse: number | null;
  mape: number | null;
  smape: number | null;
  is_best_model: boolean | null;
  training_samples: number | null;
}

export const ModelEvaluation = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ModelResult[]>([]);
  const { toast } = useToast();

  const runEvaluation = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('evaluate-forecast-models', {
        body: { productIds: [], locationIds: [] } // Empty = evaluate all
      });

      if (error) throw error;

      toast({
        title: "Model Evaluation Complete",
        description: `Evaluated ${data.pairs_evaluated} product-location pairs with ${data.models_tested} model tests.`
      });

      // Fetch best models
      await loadBestModels();
    } catch (error: any) {
      console.error('Evaluation error:', error);
      toast({
        title: "Evaluation Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBestModels = async () => {
    const { data, error } = await supabase
      .from('forecast_model_selection')
      .select('*')
      .eq('is_best_model', true)
      .order('smape', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error loading results:', error);
      return;
    }

    setResults(data || []);
  };

  const getModelColor = (modelName: string) => {
    if (modelName === 'ARIMA') return 'bg-indigo-600';
    if (modelName === 'SARIMA') return 'bg-violet-600';
    if (modelName === 'Prophet') return 'bg-fuchsia-600';
    if (modelName.startsWith('TES')) return 'bg-purple-500';
    if (modelName.startsWith('DES')) return 'bg-blue-500';
    if (modelName.startsWith('SES')) return 'bg-green-500';
    if (modelName.startsWith('WMA')) return 'bg-yellow-500';
    if (modelName.startsWith('SMA')) return 'bg-orange-500';
    if (modelName === 'LinearTrend') return 'bg-red-500';
    if (modelName === 'Croston') return 'bg-pink-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Time Series Model Evaluation</CardTitle>
          <CardDescription>
            Automatically evaluate all time series forecasting models and select the best fit for each product-location pair
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runEvaluation} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating Models...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Run Model Evaluation
                </>
              )}
            </Button>
            <Button variant="outline" onClick={loadBestModels} disabled={loading}>
              Refresh Results
            </Button>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Models Evaluated:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Simple Moving Average (SMA): 7, 14, 30 periods</li>
              <li>Weighted Moving Average (WMA): 7, 14 periods</li>
              <li>Single Exponential Smoothing (SES): α = 0.1, 0.3, 0.5</li>
              <li>Double Exponential Smoothing (DES/Holt's): α = 0.3, β = 0.1</li>
              <li>Triple Exponential Smoothing (TES/Holt-Winters): 7-day seasonality</li>
              <li>Linear Trend Model</li>
              <li>Croston's Method (for intermittent demand)</li>
              <li className="font-semibold text-primary">ARIMA (AutoRegressive Integrated Moving Average) - AI-powered</li>
              <li className="font-semibold text-primary">SARIMA (Seasonal ARIMA with weekly patterns) - AI-powered</li>
              <li className="font-semibold text-primary">Prophet (Facebook's forecasting with seasonality) - AI-powered</li>
            </ul>
            <p className="text-xs mt-2 italic">
              * AI-powered models use Lovable AI for advanced statistical forecasting
            </p>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Best Models (Top 50 by Accuracy)</CardTitle>
            <CardDescription>Showing the most accurate model for each product-location pair</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Location ID</TableHead>
                    <TableHead>Selected Model</TableHead>
                    <TableHead className="text-right">SMAPE (%)</TableHead>
                    <TableHead className="text-right">MAPE (%)</TableHead>
                    <TableHead className="text-right">MAE</TableHead>
                    <TableHead className="text-right">RMSE</TableHead>
                    <TableHead className="text-right">Samples</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">{result.product_id.slice(0, 8)}...</TableCell>
                      <TableCell className="font-mono text-xs">{result.location_id}</TableCell>
                      <TableCell>
                        <Badge className={getModelColor(result.model_name)}>
                          {result.model_name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{result.smape?.toFixed(2)}%</TableCell>
                      <TableCell className="text-right">{result.mape?.toFixed(2)}%</TableCell>
                      <TableCell className="text-right">{result.mae?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{result.rmse?.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{result.training_samples}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
