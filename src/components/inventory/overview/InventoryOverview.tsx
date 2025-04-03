import React, { useEffect, useState } from "react";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";
import { Card, CardContent } from "@/components/ui/card";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";

interface InventoryKPI {
  average_daily_usage: number;
  safety_stock: number;
  min_stock_level: number;
  max_stock_level: number;
  green_zone: number;
}

export function InventoryOverview() {
  const { filters } = useInventoryFilter();
  const [kpiData, setKpiData] = useState<InventoryKPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchInventoryPlanningView();

        // Apply filters dynamically
        const filtered = data.filter((item: any) => {
          if (filters.productCategory && item.category !== filters.productCategory) return false;
          if (filters.locationId && item.location_id !== filters.locationId) return false;
          if (filters.channelId && item.channel_id !== filters.channelId) return false;
          if (filters.decouplingOnly && !item.decoupling_point) return false;
          return true;
        });

        // Aggregate KPI calculation
        const kpi: InventoryKPI = {
          average_daily_usage: filtered.reduce((sum, item) => sum + (item.average_daily_usage || 0), 0),
          safety_stock: filtered.reduce((sum, item) => sum + (item.safety_stock || 0), 0),
          min_stock_level: filtered.reduce((sum, item) => sum + (item.min_stock_level || 0), 0),
          max_stock_level: filtered.reduce((sum, item) => sum + (item.max_stock_level || 0), 0),
          green_zone: filtered.reduce((sum, item) => sum + (item.green_zone || 0), 0),
        };

        setKpiData(kpi);
      } catch (error) {
        console.error("Error loading KPI data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters]);

  if (isLoading) {
    return <div className="p-6">Loading KPIs...</div>;
  }

  return (
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
              <h4 className="font-semibold">Safety Stock</h4>
              <p className="text-lg">{kpiData.safety_stock}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold">Min Stock</h4>
              <p className="text-lg">{kpiData.min_stock_level}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold">Max Stock</h4>
              <p className="text-lg">{kpiData.max_stock_level}</p>
            </CardContent>
          </Card>
          <Card className="col-span-full">
            <CardContent className="p-4">
              <h4 className="font-semibold">Green Zone</h4>
              <p className="text-lg">{kpiData.green_zone}</p>
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="col-span-full p-4">No KPI data available.</p>
      )}
    </div>
  );
}
