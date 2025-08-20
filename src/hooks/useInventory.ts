import { useEffect, useState } from "react";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";

export function useInventory() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>();
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await fetchInventoryPlanningView();
        setItems(data);
      } catch (err) {
        console.error("Error loading inventory:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, []);

  return { items, isLoading, error };
}
