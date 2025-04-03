import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { saveAs } from "file-saver";

interface BufferItem {
  product_id: string;
  location_id: string;
  lead_time_days: number;
  average_daily_usage: number;
  demand_variability: number;
  min_stock_level: number;
  safety_stock: number;
  max_stock_level: number;
  buffer_profile_id: string;
  decoupling_point: boolean;
}

const BufferManagementDashboard: React.FC = () => {
  const [bufferData, setBufferData] = useState<BufferItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadBufferData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();
      setBufferData(data as BufferItem[]);
    } catch (error) {
      console.error("Error fetching buffer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBufferData();
  }, []);

  const exportToCSV = () => {
    const csvContent =
      "Product ID,Location ID,Lead Time,Average Daily Usage,Demand Variability,Min Stock,Safety Stock,Max Stock,Profile,Decoupling\n" +
      bufferData
        .map((item) =>
          [
            item.product_id,
            item.location_id,
            item.lead_time_days,
            item.average_daily_usage,
            item.demand_variability,
            item.min_stock_level,
            item.safety_stock,
            item.max_stock_level,
            item.buffer_profile_id,
            item.decoupling_point ? "Yes" : "No",
          ].join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "buffer_zones.csv");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Buffer Zones Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadBufferData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="secondary" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <p>Loading buffer data...</p>
        ) : bufferData.length === 0 ? (
          <p>No buffer data found.</p>
        ) : (
          bufferData.map((item) => (
            <Card key={`${item.product_id}-${item.location_id}`} className="shadow-md hover:shadow-lg transition rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">SKU: {item.product_id}</h3>
                <p className="text-sm">Location: {item.location_id}</p>
                <p className="text-sm">Profile: {item.buffer_profile_id}</p>
                <p className="text-sm">Lead Time: {item.lead_time_days} days</p>
                <p className="text-sm">Min Stock: {item.min_stock_level}</p>
                <p className="text-sm">Safety Stock: {item.safety_stock}</p>
                <p className="text-sm">Max Stock: {item.max_stock_level}</p>
                <p className="text-sm text-muted-foreground">
                  Decoupling Point: {item.decoupling_point ? "Yes" : "No"}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BufferManagementDashboard;
