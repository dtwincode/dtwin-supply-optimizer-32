import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";

export function ClassificationManager() {
  const [classifications, setClassifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadClassifications = async () => {
    setIsLoading(true);
    const data = await fetchInventoryPlanningView();
    setClassifications(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadClassifications();
  }, []);

  const getCriticalityColor = (decouplingPoint: boolean) => {
    return decouplingPoint ? "destructive" : "secondary";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Classification Management</CardTitle>
          <CardDescription>
            Live data from Inventory Planning View
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadClassifications}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product ID</TableHead>
              <TableHead>Location ID</TableHead>
              <TableHead>Lead Time (Days)</TableHead>
              <TableHead>Demand Variability</TableHead>
              <TableHead>Average Daily Usage</TableHead>
              <TableHead>Decoupling Point</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classifications.map((item) => (
              <TableRow key={`${item.product_id}-${item.location_id}`}>
                <TableCell>{item.product_id}</TableCell>
                <TableCell>{item.location_id}</TableCell>
                <TableCell>{item.lead_time_days}</TableCell>
                <TableCell>{item.demand_variability}</TableCell>
                <TableCell>{item.average_daily_usage}</TableCell>
                <TableCell>
                  <Badge variant={getCriticalityColor(item.decoupling_point)}>
                    {item.decoupling_point ? "Yes" : "No"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
