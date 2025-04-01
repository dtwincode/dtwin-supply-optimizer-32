import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";

export function NetworkDecouplingMap() {
  const [points, setPoints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDecouplingPoints = async () => {
    setIsLoading(true);
    const data = await fetchInventoryPlanningView();
    const filtered = data.filter((item) => item.decoupling_point === true);
    setPoints(filtered);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDecouplingPoints();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Decoupling Map</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading map...</p>
        ) : points.length === 0 ? (
          <p>No decoupling points found.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {points.map((item) => (
              <li key={`${item.product_id}-${item.location_id}`}>
                🟢 {item.location_id} - {item.product_id}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
