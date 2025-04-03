import React, { useEffect, useState } from "react";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";
import { BufferManagementDashboard } from "./BufferManagementDashboard";

export function BufferManagementContent() {
  const [inventoryPlanning, setInventoryPlanning] = useState<InventoryPlanningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInventoryPlanning = async () => {
    try {
      const data = await fetchInventoryPlanningView();
      setInventoryPlanning(data);
    } catch (error) {
      console.error("Error loading inventory planning view:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryPlanning();
  }, []);

  return (
    <BufferManagementDashboard
      inventoryPlanning={inventoryPlanning}
      isLoading={isLoading}
      onRefresh={loadInventoryPlanning}
    />
  );
}
