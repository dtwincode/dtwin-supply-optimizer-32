"use client";

import { useEffect, useState } from "react";
import { DecouplingNetworkBoard } from "./DecouplingNetworkBoard";
import { DecouplingPointDialog } from "./DecouplingPointDialog";
import { NetworkDecouplingMap } from "./NetworkDecouplingMap";
import { DecouplingAnalytics } from "./DecouplingAnalytics";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DecouplingDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{
    productId: string;
    locationId: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const records = await fetchInventoryPlanningView();
    setData(records || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDialog = (productId: string, locationId: string) => {
    setSelectedPoint({ productId, locationId });
    setDialogOpen(true);
  };

  const decouplingItems = data.filter((item) => item.decoupling_point === true);

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {/* Summary Board */}
      <Card>
        <CardHeader>
          <CardTitle>Decoupling Points Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <DecouplingNetworkBoard />
        </CardContent>
      </Card>

      {/* Network Map */}
      <Card>
        <CardHeader>
          <CardTitle>Network Map</CardTitle>
        </CardHeader>
        <CardContent>
          <NetworkDecouplingMap />
        </CardContent>
      </Card>

      {/* Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <DecouplingAnalytics items={data} />
        </CardContent>
      </Card>

      {/* Dialog */}
      <DecouplingPointDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        productId={selectedPoint?.productId || ""}
        locationId={selectedPoint?.locationId || ""}
      />
    </div>
  );
}
