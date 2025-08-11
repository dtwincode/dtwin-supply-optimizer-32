import { useEffect, useState } from "react";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";

export function useInventory() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await fetchInventoryPlanningView();
        setItems(data);
      } catch (error) {
        console.error("Error loading inventory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, []);

  return { items, isLoading };
}
