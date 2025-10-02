import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { useInventoryFilter } from "../InventoryFilterContext";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";

export function BufferStatusGrid() {
  const { filters } = useInventoryFilter();
  const [bufferData, setBufferData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBufferStatus();
  }, [filters]);

  const loadBufferStatus = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();

      let filtered = data.filter((item: any) => item.decoupling_point === true);

      if (filters.productCategory) {
        filtered = filtered.filter((item) => item.category === filters.productCategory);
      }
      if (filters.locationId) {
        filtered = filtered.filter((item) => item.location_id === filters.locationId);
      }

      setBufferData(filtered);
    } catch (error) {
      console.error("Error loading buffer status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "RED":
        return "bg-destructive text-destructive-foreground";
      case "YELLOW":
        return "bg-yellow-500 dark:bg-yellow-600 text-white";
      case "GREEN":
        return "bg-green-600 dark:bg-green-700 text-white";
      case "BLUE":
        return "bg-blue-600 dark:bg-blue-700 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusUpper = status?.toUpperCase();
    const colorClass = getStatusColor(status);
    
    return (
      <Badge className={colorClass}>
        {statusUpper}
      </Badge>
    );
  };

  const calculatePenetration = (item: any) => {
    if (!item.nfp || !item.tog) return 0;
    return Math.round((item.nfp / item.tog) * 100);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-96 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Buffer Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">
                {bufferData.filter((b) => b.buffer_status === "RED").length}
              </div>
              <div className="text-sm text-muted-foreground">Critical (Red)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                {bufferData.filter((b) => b.buffer_status === "YELLOW").length}
              </div>
              <div className="text-sm text-muted-foreground">Warning (Yellow)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                {bufferData.filter((b) => b.buffer_status === "GREEN").length}
              </div>
              <div className="text-sm text-muted-foreground">Healthy (Green)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                {bufferData.filter((b) => b.buffer_status === "BLUE").length}
              </div>
              <div className="text-sm text-muted-foreground">Excess (Blue)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bufferData.map((item) => (
          <Card key={`${item.product_id}-${item.location_id}`} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold">{item.sku || item.product_id}</div>
                  <div className="text-sm text-muted-foreground">{item.product_name}</div>
                  <Badge variant="outline" className="mt-1">{item.location_id}</Badge>
                </div>
                {getStatusBadge(item.buffer_status)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">On Hand:</span>
                  <span className="font-medium">{item.on_hand?.toFixed(0) || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">On Order:</span>
                  <span className="font-medium">{item.on_order?.toFixed(0) || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NFP:</span>
                  <span className="font-medium">{item.nfp?.toFixed(0) || 0}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>TOR (Red):</span>
                    <span>{item.tor?.toFixed(0) || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>TOY (Yellow):</span>
                    <span>{item.toy?.toFixed(0) || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>TOG (Green):</span>
                    <span>{item.tog?.toFixed(0) || 0}</span>
                  </div>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Penetration:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{calculatePenetration(item)}%</span>
                    {calculatePenetration(item) > 80 ? (
                      <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bufferData.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              No decoupling points found. Please designate strategic positions first.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
