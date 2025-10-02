import { useEffect, useState } from "react";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import type { InventoryPlanningItem } from "@/types/inventory/planningTypes";

export function useInventory() {
  const [items, setItems] = useState<InventoryPlanningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadInventory = async () => {
      try {
        setIsLoading(true);
        const data = await fetchInventoryPlanningView();
        setItems(data);
        setError(null);
      } catch (err) {
        console.error("Error loading inventory:", err);
        setError(err instanceof Error ? err : new Error('Failed to load inventory'));
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, []);

  return { items, isLoading, error };
}
