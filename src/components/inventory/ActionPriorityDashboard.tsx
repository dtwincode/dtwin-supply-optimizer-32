import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBufferData } from "@/hooks/useBufferData";
import { DashboardSkeleton } from "./SkeletonLoader";

export function ActionPriorityDashboard() {
  const navigate = useNavigate();
  const { items, metrics, isLoading } = useBufferData();

  if (isLoading) return <DashboardSkeleton />;

  const criticalItems = items.filter(item => item.buffer_status === 'RED').slice(0, 10);
  const warningItems = items.filter(item => item.buffer_status === 'YELLOW').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Priority Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-destructive bg-destructive/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-lg">Critical Actions</CardTitle>
              </div>
              <Badge variant="destructive" className="text-base px-3 py-1">
                {metrics.criticalCount}
              </Badge>
            </div>
            <CardDescription>Immediate replenishment required</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/inventory?view=exceptions')}
              variant="destructive" 
              className="w-full"
            >
              View All Critical <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-yellow-500 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-lg">Warning</CardTitle>
              </div>
              <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-600 text-base px-3 py-1">
                {metrics.warningCount}
              </Badge>
            </div>
            <CardDescription>Monitor closely</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/inventory?view=buffers')}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-950"
            >
              Review Buffers <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-500 bg-green-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Healthy</CardTitle>
              </div>
              <Badge className="bg-green-500 text-green-950 hover:bg-green-600 text-base px-3 py-1">
                {metrics.healthyCount}
              </Badge>
            </div>
            <CardDescription>Optimal buffer levels</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/inventory?view=analytics')}
              variant="outline"
              className="w-full border-green-500 text-green-700 hover:bg-green-50"
            >
              View Analytics <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Critical Items Requiring Immediate Action */}
      {criticalItems.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Immediate Action Required
                </CardTitle>
                <CardDescription className="mt-1">
                  These items are in RED zone and need urgent replenishment
                </CardDescription>
              </div>
              <Button onClick={() => navigate('/inventory?view=exceptions')}>
                View All ({metrics.criticalCount})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalItems.map((item, idx) => {
                const penetration = item.nfp && item.tor 
                  ? Math.round((item.nfp / item.tor) * 100)
                  : 0;
                
                return (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name || item.sku}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.location_id} • {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">On Hand: {item.on_hand?.toFixed(0) || 0}</p>
                          <p className="text-xs text-muted-foreground">
                            NFP: {item.nfp?.toFixed(0) || 0} / TOR: {item.tor?.toFixed(0) || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <div className="text-right">
                        <Badge variant="destructive" className="mb-1">
                          {penetration}% Penetration
                        </Badge>
                        <p className="text-xs text-muted-foreground">Priority: {10 - idx}</p>
                      </div>
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning Items */}
      {warningItems.length > 0 && (
        <Card className="border-yellow-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Monitor Closely
                </CardTitle>
                <CardDescription className="mt-1">
                  Items approaching reorder thresholds
                </CardDescription>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/inventory?view=buffers')}
              >
                View Buffers
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {warningItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{item.product_name || item.sku}</p>
                    <p className="text-xs text-muted-foreground">{item.location_id}</p>
                  </div>
                  <Badge className="bg-yellow-500 text-yellow-950">
                    Yellow Zone
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
