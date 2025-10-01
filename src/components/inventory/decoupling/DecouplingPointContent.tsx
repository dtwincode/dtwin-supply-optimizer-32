import React, { useEffect, useState } from "react";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";

export function DecouplingPointContent() {
  const [decouplingItems, setDecouplingItems] = useState<InventoryPlanningItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDecoupling = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();
      const filtered = data.filter((item) => item.decoupling_point === true);
      setDecouplingItems(filtered);
    } catch (error) {
      console.error("Error loading decoupling points:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDecoupling();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decoupling Point Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul className="space-y-2">
            {decouplingItems.map((item) => (
              <li key={`${item.product_id}-${item.location_id}`}>
                <Badge variant="outline">
                  {item.product_id} - {item.location_id}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
