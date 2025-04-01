
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";
import { calculateBufferPenetration } from "@/utils/inventoryUtils";

interface InventoryPlanningTableProps {
  data: InventoryPlanningItem[];
  loading: boolean;
}

export function InventoryPlanningTable({ data, loading }: InventoryPlanningTableProps) {
  // Calculate buffer zones from planning data
  const getBufferZones = (item: InventoryPlanningItem) => {
    return {
      red: item.safety_stock,
      yellow: item.min_stock_level - item.safety_stock,
      green: item.max_stock_level - item.min_stock_level,
      total: item.max_stock_level
    };
  };

  // Get buffer status based on penetration
  const getBufferStatus = (item: InventoryPlanningItem) => {
    const bufferZones = getBufferZones(item);
    
    // Mock on-hand value (in a real app, you'd get this from the inventory data)
    const onHand = Math.floor(Math.random() * item.max_stock_level);
    
    const bufferPenetration = calculateBufferPenetration(
      onHand,
      { red: bufferZones.red, yellow: bufferZones.yellow, green: bufferZones.green }
    );
    
    if (bufferPenetration >= 80) return 'critical';
    if (bufferPenetration >= 40) return 'warning';
    return 'healthy';
  };

  // Format a numeric value to have commas for thousands and be rounded to 2 decimal places
  const formatNumber = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // Get appropriate color for buffer status badge
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'warning': return 'warning';
      case 'healthy': return 'success';
      default: return 'outline';
    }
  };

  // Memoize the buffer status calculations to avoid recalculating on each render
  const itemsWithStatus = useMemo(() => {
    return data.map(item => ({
      ...item,
      status: getBufferStatus(item)
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        No planning data found with the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Lead Time (days)</TableHead>
            <TableHead className="text-right">Avg. Daily Usage</TableHead>
            <TableHead className="text-right">Variability</TableHead>
            <TableHead className="text-right">Min Stock</TableHead>
            <TableHead className="text-right">Safety Stock</TableHead>
            <TableHead className="text-right">Max Stock</TableHead>
            <TableHead>Buffer Profile</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Decoupling Point</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemsWithStatus.map((item) => (
            <TableRow key={`${item.product_id}-${item.location_id}`}>
              <TableCell className="font-medium">{item.product_id}</TableCell>
              <TableCell>{item.location_id}</TableCell>
              <TableCell className="text-right">{item.lead_time_days}</TableCell>
              <TableCell className="text-right">{formatNumber(item.average_daily_usage)}</TableCell>
              <TableCell className="text-right">{formatNumber(item.demand_variability)}</TableCell>
              <TableCell className="text-right">{formatNumber(item.min_stock_level)}</TableCell>
              <TableCell className="text-right">{formatNumber(item.safety_stock)}</TableCell>
              <TableCell className="text-right">{formatNumber(item.max_stock_level)}</TableCell>
              <TableCell>{item.buffer_profile_id}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(item.status)}>
                  {item.status === 'critical' ? 'Critical' : 
                   item.status === 'warning' ? 'Warning' : 'Healthy'}
                </Badge>
              </TableCell>
              <TableCell>
                {item.decoupling_point ? (
                  <Badge variant="secondary">Decoupling Point</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
