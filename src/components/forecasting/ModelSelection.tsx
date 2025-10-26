import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleDot } from "lucide-react";

const models = [
  {
    id: 'moving_average',
    name: 'Moving Average',
    description: 'Simple average of recent periods. Best for stable demand patterns.',
    status: 'active',
    complexity: 'Low',
    accuracy: 'Medium',
    use_case: 'Stable products with consistent demand'
  },
  {
    id: 'exponential_smoothing',
    name: 'Exponential Smoothing',
    description: 'Weighted average giving more importance to recent data. Adapts to trends.',
    status: 'available',
    complexity: 'Medium',
    accuracy: 'High',
    use_case: 'Products with trends or seasonal patterns'
  },
  {
    id: 'arima',
    name: 'ARIMA',
    description: 'Advanced statistical model for complex patterns and seasonality.',
    status: 'available',
    complexity: 'High',
    accuracy: 'Very High',
    use_case: 'Complex demand patterns with multiple factors'
  }
];

export const ModelSelection = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Forecasting Models</CardTitle>
          <CardDescription>
            Select the forecasting algorithm for finished products. Currently using Moving Average (DDMRP-aligned baseline).
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-1">
        {models.map((model) => (
          <Card key={model.id} className={model.status === 'active' ? 'border-primary' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    {model.status === 'active' && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{model.description}</CardDescription>
                </div>
                {model.status === 'available' && (
                  <Button variant="outline" size="sm">
                    Activate
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Complexity</p>
                  <Badge variant="outline">{model.complexity}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Accuracy</p>
                  <Badge variant="outline">{model.accuracy}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Best For</p>
                  <p className="text-xs">{model.use_case}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DDMRP Note */}
      <Card className="border-muted bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CircleDot className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">DDMRP Forecasting Principle</p>
              <p className="text-xs text-muted-foreground">
                In DDMRP, forecasts are used ONLY for strategic planning of finished products. 
                Component replenishment is purely demand-driven through buffer zones and does NOT use forecasts. 
                This prevents forecast error propagation through the BOM.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
