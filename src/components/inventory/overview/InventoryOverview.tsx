import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";

interface OverviewStats {
  totalSKUs: number;
  decouplingCount: number;
  bufferProfileDistribution: { red: number; yellow: number; green: number };
}

export function InventoryOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadOverviewStats = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();

      const totalSKUs = data.length;
      const decouplingCount = data.filter((item: any) => item.decoupling_point).length;
      const profileCounts = {
        red: data.filter((item: any) => item.buffer_profile_id === "BP001").length,
        yellow: data.filter((item: any) => item.buffer_profile_id === "BP002").length,
        green: data.filter((item: any) => item.buffer_profile_id === "BP003").length,
      };

      setStats({
        totalSKUs,
        decouplingCount,
        bufferProfileDistribution: profileCounts,
      });
    } catch (error) {
      console.error("Error loading overview stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOverviewStats();
  }, []);

  if (isLoading || !stats) {
    return <div className="p-4">Loading Overview...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Total SKUs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalSKUs}</p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Decoupling Points</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.decouplingCount}</p>
          <p className="text-sm text-muted-foreground">
            {((stats.decouplingCount / stats.totalSKUs) * 100).toFixed(1)}% of total SKUs
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Buffer Profile Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-sm">🔴 Red (Low Variability): {stats.bufferProfileDistribution.red}</p>
          <p className="text-sm">🟡 Yellow (Medium Variability): {stats.bufferProfileDistribution.yellow}</p>
          <p className="text-sm">🟢 Green (High Variability): {stats.bufferProfileDistribution.green}</p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Service Level</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">Dynamic</p>
          <p className="text-sm text-muted-foreground">To be calculated from Performance Table</p>
        </CardContent>
      </Card>
    </div>
  );
}
