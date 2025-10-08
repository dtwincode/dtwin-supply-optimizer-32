import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useBufferData } from "@/hooks/useBufferData";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";
import { DashboardSkeleton } from "../SkeletonLoader";

interface BufferDashboardProps {
  mode: "overview" | "status" | "management";
}

export function BufferDashboard({ mode }: BufferDashboardProps) {
  const { items, metrics, isLoading } = useBufferData();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RED': return 'bg-destructive text-destructive-foreground';
      case 'YELLOW': return 'bg-yellow-500 text-white';
      case 'GREEN': return 'bg-green-500 text-white';
      case 'BLUE': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const calculatePenetration = (item: InventoryPlanningItem) => {
    if (!item.tog || item.tog === 0) return 0;
    return ((item.nfp || 0) / item.tog) * 100;
  };

  const getPenetrationTrend = (penetration: number) => {
    if (penetration > 100) return <TrendingUp className="h-3 w-3 text-blue-500" />;
    if (penetration < 50) return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-yellow-500" />;
  };

  if (mode === "overview") {
    return (
      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalItems}</div>
            </CardContent>
          </Card>
          
          <Card className="border-destructive/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Critical
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-3 w-3" /></TooltipTrigger>
                    <TooltipContent>Items in RED zone - immediate action required</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{metrics.criticalCount}</div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{metrics.warningCount}</div>
            </CardContent>
          </Card>

          <Card className="border-green-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Healthy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.healthyCount}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Excess</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics.excessCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Items Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items
                .filter(item => item.buffer_status === 'RED')
                .slice(0, 5)
                .map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-sm text-muted-foreground">{item.location_id}</div>
                    </div>
                    <Badge className={getStatusColor(item.buffer_status)}>
                      {item.buffer_status}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "status") {
    return (
      <div className="space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { status: 'RED', count: metrics.criticalCount, label: 'Critical' },
            { status: 'YELLOW', count: metrics.warningCount, label: 'Warning' },
            { status: 'GREEN', count: metrics.healthyCount, label: 'Healthy' },
            { status: 'BLUE', count: metrics.excessCount, label: 'Excess' },
          ].map(({ status, count, label }) => (
            <Card key={status} className="text-center">
              <CardContent className="pt-6">
                <Badge className={`${getStatusColor(status)} mb-2`}>{label}</Badge>
                <div className="text-3xl font-bold">{count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Buffer Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items
            .filter(item => item.decoupling_point)
            .map(item => {
              const penetration = calculatePenetration(item);
              return (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm">{item.product_name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{item.location_id}</p>
                      </div>
                      <Badge className={getStatusColor(item.buffer_status)}>
                        {item.buffer_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">On Hand:</span>
                        <div className="font-medium">{item.on_hand}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">On Order:</span>
                        <div className="font-medium">{item.on_order}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">NFP:</span>
                        <div className="font-medium">{item.nfp}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Penetration:</span>
                        <div className="font-medium flex items-center gap-1">
                          {penetration.toFixed(0)}%
                          {getPenetrationTrend(penetration)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    );
  }

  // Management mode
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">{item.product_name}</CardTitle>
              <p className="text-sm text-muted-foreground">Location: {item.location_id}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Red Zone:</span>
                  <span className="font-medium">{item.red_zone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Yellow Zone:</span>
                  <span className="font-medium">{item.yellow_zone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Green Zone:</span>
                  <span className="font-medium">{item.green_zone}</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Buffer Profile:</span>
                  <Badge variant="outline">{item.buffer_profile_id}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
