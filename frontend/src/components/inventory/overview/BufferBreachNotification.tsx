
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BufferBreachNotification() {
  const { filters } = useInventoryFilter();
  const [breachCount, setBreachCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const checkBreaches = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();

      const filtered = data.filter((item: any) => {
        if (filters.productCategory && item.category !== filters.productCategory) return false;
        if (filters.locationId && item.location_id !== filters.locationId) return false;
        if (filters.channelId && item.channel_id !== filters.channelId) return false;
        if (filters.decouplingOnly && !item.decoupling_point) return false;
        return true;
      });

      const breaches = filtered.filter(
        (item: any) =>
          item.current_stock_level < item.min_stock_level || // Stockout Risk
          item.current_stock_level > item.max_stock_level // Overstock Risk
      );

      setBreachCount(breaches.length);
    } catch (error) {
      console.error("Error checking buffer breaches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkBreaches();
  }, [filters]);

  const handleRefresh = () => {
    checkBreaches();
  };

  if (isLoading) {
    return (
      <Alert variant="default" className="border-gray-300 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <RefreshCw className="h-5 w-5 animate-spin mr-2 text-gray-500" />
            <AlertTitle>Checking buffer status...</AlertTitle>
          </div>
        </div>
      </Alert>
    );
  }

  if (breachCount === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="border-red-600 bg-red-50 text-red-800">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <div>
            <AlertTitle>Buffer Breach Alert</AlertTitle>
            <AlertDescription>
              {breachCount} SKUs have breached their buffer levels. Immediate action required!
            </AlertDescription>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          className="bg-white hover:bg-gray-100 border-red-300 text-red-800"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
    </Alert>
  );
}
