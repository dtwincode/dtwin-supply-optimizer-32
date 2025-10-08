import { useEffect, useState } from "react";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";
import { useInventoryFilter } from "@/components/inventory/InventoryFilterContext";

export interface BufferMetrics {
  totalItems: number;
  decouplingPoints: number;
  criticalCount: number;
  warningCount: number;
  healthyCount: number;
  excessCount: number;
}

export function useBufferData() {
  const { filters } = useInventoryFilter();
  const [items, setItems] = useState<InventoryPlanningItem[]>([]);
  const [metrics, setMetrics] = useState<BufferMetrics>({
    totalItems: 0,
    decouplingPoints: 0,
    criticalCount: 0,
    warningCount: 0,
    healthyCount: 0,
    excessCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchInventoryPlanningView();

        // Apply filters
        const filtered = data.filter((item: InventoryPlanningItem) => {
          if (filters.productId && item.product_id !== filters.productId) return false;
          if (filters.locationId && item.location_id !== filters.locationId) return false;
          if (filters.channelId && item.channel_id !== filters.channelId) return false;
          if (filters.decouplingOnly && !item.decoupling_point) return false;
          return true;
        });

        setItems(filtered);

        // Calculate metrics
        const newMetrics: BufferMetrics = {
          totalItems: filtered.length,
          decouplingPoints: filtered.filter(item => item.decoupling_point).length,
          criticalCount: filtered.filter(item => item.buffer_status === 'RED').length,
          warningCount: filtered.filter(item => item.buffer_status === 'YELLOW').length,
          healthyCount: filtered.filter(item => item.buffer_status === 'GREEN').length,
          excessCount: filtered.filter(item => item.buffer_status === 'BLUE').length,
        };

        setMetrics(newMetrics);
        setError(null);
      } catch (err) {
        console.error("Error loading buffer data:", err);
        setError(err instanceof Error ? err : new Error('Failed to load buffer data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters]);

  return { items, metrics, isLoading, error, refresh: () => setIsLoading(true) };
}
