
import React, { useEffect, useState } from "react";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { BufferBreachNotification } from "./BufferBreachNotification";
import { BufferProfileDistributionChart } from "./BufferProfileDistributionChart";
import { RefreshCw, TrendingUp, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EnhancedMetricCard } from "../EnhancedMetricCard";
import { MetricCardSkeleton } from "../SkeletonLoader";

interface InventoryKPI {
  average_daily_usage: number;
  min_stock_level: number;
  max_stock_level: number;
  green_zone: number;
  trend?: {
    adu_change: number;
    stock_change: number;
  };
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
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </>
        ) : kpiData ? (
          <>
            <EnhancedMetricCard
              title="Avg Daily Usage"
              value={kpiData.average_daily_usage.toFixed(2)}
              icon={TrendingUp}
              trend={kpiData.trend ? {
                value: kpiData.trend.adu_change,
                label: "vs last period"
              } : undefined}
              status="healthy"
              benchmark="Target: 150 units"
              sparklineData={[45, 52, 48, 65, 58, 72, 68]}
            />
            <EnhancedMetricCard
              title="Min Stock Level"
              value={kpiData.min_stock_level.toLocaleString()}
              icon={Package}
              subtitle="Safety stock threshold"
              status={kpiData.min_stock_level < 1000 ? "warning" : "healthy"}
            />
            <EnhancedMetricCard
              title="Max Stock Level"
              value={kpiData.max_stock_level.toLocaleString()}
              icon={AlertCircle}
              subtitle="Maximum capacity"
              status="neutral"
            />
            <EnhancedMetricCard
              title="Green Zone Stock"
              value={kpiData.green_zone.toLocaleString()}
              icon={Package}
              trend={kpiData.trend ? {
                value: kpiData.trend.stock_change,
                label: "vs last period"
              } : undefined}
              status="healthy"
              subtitle="Replenishment buffer"
            />
          </>
        ) : (
          <p className="col-span-full p-4">No KPI data available.</p>
        )}
      </div>

      <BufferProfileDistributionChart />
    </div>
  );
}
