import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";

export function BufferBreachNotification() {
  const { filters } = useInventoryFilter();
  const [breachCount, setBreachCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkBreaches = async () => {
      setIsLoading(true);
      try {
        const data = await fetchInventoryPlanningView();

        const filtered = data.filter((item: any) => {
          if (filters.productCategory && item.category !== filters.productCategory) return false;
          if (filters.location_id && item.location_id !== filters.locationId) return false;
          if (filters.channel_id && item.channel_id !== filters.channelId) return false;
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

    checkBreaches();
  }, [filters]);

  if (isLoading || breachCount === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="border-red-600 bg-red-50 text-red-800">
      <ExclamationTriangleIcon className="h-5 w-5" />
      <AlertTitle>Buffer Breach Alert</AlertTitle>
      <AlertDescription>
        {breachCount} SKUs have breached their buffer levels. Immediate action required!
      </AlertDescription>
    </Alert>
  );
}
