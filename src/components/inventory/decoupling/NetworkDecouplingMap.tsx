
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryItem } from "@/types/inventory";
import { useInventory } from "@/hooks/useInventory";
import { Badge } from "@/components/ui/badge";

export const NetworkDecouplingMap = () => {
  const [decouplingPoints, setDecouplingPoints] = useState<InventoryItem[]>([]);
  const [regularNodes, setRegularNodes] = useState<InventoryItem[]>([]);
  
  const { items, loading } = useInventory(1, 100, "", "", false);

  useEffect(() => {
    if (items && items.length > 0) {
      // Filter items that are decoupling points
      const dPoints = items.filter(item => item.decouplingPointId || item.decoupling_point === true);
      const regular = items.filter(item => !item.decouplingPointId && !item.decoupling_point);
      
      setDecouplingPoints(dPoints);
      setRegularNodes(regular);
    }
  }, [items]);

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading network data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Network Decoupling Map</span>
          <Badge variant="outline" className="ml-2">Visualization</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {decouplingPoints.length === 0 ? (
          <div className="h-64 flex items-center justify-center flex-col">
            <p className="text-muted-foreground">No decoupling points defined yet</p>
            <p className="text-sm">Define strategic decoupling points to visualize your network</p>
          </div>
        ) : (
          <div className="h-96 border rounded-md p-4 relative">
            <div className="text-center mb-4">
              <Badge className="mb-2">
                {decouplingPoints.length} Decoupling Points
              </Badge>
              <p className="text-sm text-muted-foreground">
                Network visualization requires more data to render properly
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {decouplingPoints.slice(0, 6).map((point, index) => (
                <div 
                  key={point.id}
                  className="border rounded-md p-3 bg-primary/5 text-center"
                >
                  <div className="font-medium truncate">{point.name}</div>
                  <div className="text-xs text-muted-foreground">{point.location}</div>
                  <Badge variant="secondary" className="mt-2">Decoupling Point</Badge>
                </div>
              ))}
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground bg-white/80 px-3 py-1 rounded text-sm">
                Interactive visualization coming soon
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
