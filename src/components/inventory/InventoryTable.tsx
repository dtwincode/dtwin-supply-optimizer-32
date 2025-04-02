
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryItem } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InventoryTableProps {
  data: InventoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onCreatePO: (item: InventoryItem) => void;
}

export const InventoryTable = ({ data, pagination, onCreatePO }: InventoryTableProps) => {
  const getBadgeVariant = (priority: string) => {
    if (!priority) return "outline";
    
    switch (priority.toLowerCase()) {
      case "critical":
      case "very high":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Net Flow</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No inventory items found
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.currentStock}</TableCell>
                <TableCell>{item.netFlowPosition}</TableCell>
                <TableCell>
                  {item.planningPriority && (
                    <Badge variant={getBadgeVariant(item.planningPriority)}>
                      {item.planningPriority}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${item.bufferPenetration && item.bufferPenetration > 80 ? 'bg-red-500' : item.bufferPenetration && item.bufferPenetration > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <span>
                      {item.bufferPenetration && item.bufferPenetration > 80 
                        ? 'Red' 
                        : item.bufferPenetration && item.bufferPenetration > 40 
                        ? 'Yellow' 
                        : 'Green'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCreatePO(item)}
                  >
                    Create PO
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
