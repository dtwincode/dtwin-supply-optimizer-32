import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";

export function DecouplingNetworkBoard() {
  const [decouplingPoints, setDecouplingPoints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDecouplingPoints = async () => {
    setIsLoading(true);
    const data = await fetchInventoryPlanningView();
    const filtered = data.filter((item) => item.decoupling_point === true);
    setDecouplingPoints(filtered);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDecouplingPoints();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decoupling Network Board</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading decoupling points...</p>
        ) : decouplingPoints.length === 0 ? (
          <p>No decoupling points found.</p>
        ) : (
          <ul className="space-y-2">
            {decouplingPoints.map((item) => (
              <li
                key={`${item.product_id}-${item.location_id}`}
                className="flex items-center gap-2"
              >
                <Badge variant="destructive">Decoupling</Badge>
                <span className="text-sm">
                  {item.product_id} @ {item.location_id}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
