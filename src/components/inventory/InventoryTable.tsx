
import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  InventoryItem, 
  PaginationState, 
  BufferZones, 
  NetFlowPosition 
} from "@/types/inventory";
import { BufferStatusBadge } from "./BufferStatusBadge";
import { BufferVisualizer } from "./BufferVisualizer";
import { CreatePODialog } from "./CreatePODialog";
import { 
  calculateBufferZones,
  calculateNetFlowPosition,
  calculateBufferPenetration,
  getBufferStatus 
} from "@/utils/bufferCalculations";
import { Loader2 } from "lucide-react";

interface InventoryTableProps {
  items: InventoryItem[];
  loading: boolean;
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onCreatePO: (item: InventoryItem) => void;
}

export const InventoryTable = ({ 
  items, 
  loading, 
  pagination, 
  onPageChange, 
  onCreatePO 
}: InventoryTableProps) => {
  const [itemBuffers, setItemBuffers] = useState<Record<string, {
    bufferZones: BufferZones;
    netFlow: NetFlowPosition;
    bufferPenetration: number;
    status: 'green' | 'yellow' | 'red';
  }>>({});

  useEffect(() => {
    const loadBufferData = async () => {
      const bufferData: Record<string, any> = {};
      
      for (const item of items) {
        const bufferZones = await calculateBufferZones(item);
        const netFlow = calculateNetFlowPosition(item);
        const bufferPenetration = calculateBufferPenetration(netFlow.netFlowPosition, bufferZones);
        const status = getBufferStatus(bufferPenetration);
        
        bufferData[item.id] = {
          bufferZones,
          netFlow,
          bufferPenetration,
          status
        };
      }
      
      setItemBuffers(bufferData);
    };

    if (items.length > 0) {
      loadBufferData();
    }
  }, [items]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Buffer</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24">
                No inventory items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const bufferData = itemBuffers[item.id];
              
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.onHand}</TableCell>
                  <TableCell>
                    {bufferData ? (
                      <BufferStatusBadge status={bufferData.status} />
                    ) : (
                      <span className="text-muted-foreground">Loading...</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {bufferData ? (
                      <BufferVisualizer 
                        netFlowPosition={bufferData.netFlow.netFlowPosition}
                        bufferZones={bufferData.bufferZones}
                        adu={item.adu}
                      />
                    ) : (
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    )}
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {bufferData ? (
                      <CreatePODialog 
                        item={item}
                        bufferZones={bufferData.bufferZones}
                        onSuccess={() => onCreatePO(item)}
                      />
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Create PO
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      
      <div className="mt-4 flex justify-between items-center p-6">
        <div className="text-sm text-gray-500">
          Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} items
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
