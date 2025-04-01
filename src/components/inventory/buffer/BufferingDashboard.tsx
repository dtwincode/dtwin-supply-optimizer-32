"use client";

import { useEffect, useState } from "react";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { EnhancedBufferVisualizer } from "./EnhancedBufferVisualizer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function BufferingDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const records = await fetchInventoryPlanningView();
    setData(records || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {isLoading ? (
        <p>Loading buffering data...</p>
      ) : data.length === 0 ? (
        <p>No inventory data found.</p>
      ) : (
        data.map((item) => {
          const red = item.safety_stock || 0;
          const yellow =
            (item.max_stock_level || 0) -
            (item.min_stock_level || 0) -
            (item.safety_stock || 0);
          const green = item.min_stock_level || 0;
          const nfp = item.average_daily_usage || 0;

          return (
            <Card key={`${item.product_id}-${item.location_id}`}>
              <CardHeader>
                <CardTitle>
                  {item.product_id} @ {item.location_id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedBufferVisualizer
                  netFlowPosition={nfp}
                  bufferZones={{ red, yellow, green }}
                  adu={nfp}
                />
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

