import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { useInventoryFilter } from "../InventoryFilterContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Activity, AlertCircle } from "lucide-react";

export function BufferPerformance() {
  const { filters } = useInventoryFilter();
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, [filters]);

  const loadPerformanceData = async () => {
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

      setPerformanceData(filtered);
    } catch (error) {
      console.error("Error loading performance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = () => {
    const total = performanceData.length;
    const redCount = performanceData.filter((item) => item.buffer_status === "RED").length;
    const yellowCount = performanceData.filter((item) => item.buffer_status === "YELLOW").length;
    const greenCount = performanceData.filter((item) => item.buffer_status === "GREEN").length;

    const avgPenetration = performanceData.reduce((sum, item) => {
      const penetration = item.nfp && item.tog ? (item.nfp / item.tog) * 100 : 0;
      return sum + penetration;
    }, 0) / total || 0;

    const serviceLevel = ((greenCount + yellowCount) / total) * 100 || 0;

    return {
      total,
      redCount,
      yellowCount,
      greenCount,
      avgPenetration: avgPenetration.toFixed(1),
      serviceLevel: serviceLevel.toFixed(1),
    };
  };

  const getStatusDistribution = () => {
    const metrics = calculateMetrics();
    return [
      { name: "Red Zone", value: metrics.redCount, fill: "#ef4444" },
      { name: "Yellow Zone", value: metrics.yellowCount, fill: "#eab308" },
      { name: "Green Zone", value: metrics.greenCount, fill: "#22c55e" },
    ];
  };

  const getBufferProfilePerformance = () => {
    const profiles = ["BP_DEFAULT", "BP_LOW", "BP_MEDIUM", "BP_HIGH"];
    return profiles.map((profile) => {
      const items = performanceData.filter((item) => item.buffer_profile_id === profile);
      const greenCount = items.filter((item) => item.buffer_status === "GREEN").length;
      const serviceLevel = items.length > 0 ? (greenCount / items.length) * 100 : 0;

      return {
        profile,
        items: items.length,
        serviceLevel: serviceLevel.toFixed(1),
      };
    });
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

  const metrics = calculateMetrics();
  const statusDistribution = getStatusDistribution();
  const profilePerformance = getBufferProfilePerformance();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Level</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.serviceLevel}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.greenCount + metrics.yellowCount} of {metrics.total} in healthy zones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Buffer Penetration</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgPenetration}%</div>
            <p className="text-xs text-muted-foreground">Average across all buffers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{metrics.redCount}</div>
            <p className="text-xs text-muted-foreground">Items in red zone</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Buffer Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buffer Profile Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profilePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="profile" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="serviceLevel" stroke="#8884d8" name="Service Level %" />
                <Line type="monotone" dataKey="items" stroke="#82ca9d" name="Item Count" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
