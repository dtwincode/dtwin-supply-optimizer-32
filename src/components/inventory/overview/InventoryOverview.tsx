
import React, { useEffect, useState } from "react";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";
import { Card, CardContent } from "@/components/ui/card";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { BufferBreachNotification } from "./BufferBreachNotification";
import { BufferProfileDistributionChart } from "./BufferProfileDistributionChart";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InventoryKPI {
  average_daily_usage: number;
  min_stock_level: number;
  max_stock_level: number;
  green_zone: number;
}

export function InventoryOverview() {
  const { filters } = useInventoryFilter();
  const [kpiData, setKpiData] = useState<InventoryKPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();

      const filtered = data.filter((item: any) => {
        if (filters.productId && item.product_id !== filters.productId) return false;
        if (filters.locationId && item.location_id !== filters.locationId) return false;
        if (filters.channelId && item.channel_id !== filters.channelId) return false;
        if (filters.decouplingOnly && !item.decoupling_point) return false;
        return true;
      });

      const kpi: InventoryKPI = {
        average_daily_usage: Math.round(filtered.reduce((sum, item) => sum + (item.average_daily_usage || 0), 0) * 100) / 100,
        min_stock_level: Math.round(filtered.reduce((sum, item) => sum + (item.min_stock_level || 0), 0)),
        max_stock_level: Math.round(filtered.reduce((sum, item) => sum + (item.max_stock_level || 0), 0)),
        green_zone: Math.round(filtered.reduce((sum, item) => sum + (item.green_zone || 0), 0)),
      };

      setKpiData(kpi);
      toast.success("Inventory data refreshed successfully");
    } catch (error) {
      console.error("Error loading KPI data:", error);
      toast.error("Failed to refresh inventory data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleRefresh = () => {
    loadData();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inventory Overview</h2>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="ml-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <BufferBreachNotification />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpiData ? (
          <>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold">Avg Daily Usage</h4>
                <p className="text-lg">{kpiData.average_daily_usage.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold">Min Stock</h4>
                <p className="text-lg">{kpiData.min_stock_level.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold">Max Stock</h4>
                <p className="text-lg">{kpiData.max_stock_level.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="col-span-full">
              <CardContent className="p-4">
                <h4 className="font-semibold">Green Zone</h4>
                <p className="text-lg">{kpiData.green_zone.toLocaleString()}</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <p className="col-span-full p-4">No KPI data available.</p>
        )}
      </div>

      <BufferProfileDistributionChart />
    </div>
  );
}
