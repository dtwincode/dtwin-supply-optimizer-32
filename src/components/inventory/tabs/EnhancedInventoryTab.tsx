
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ShoppingCart, AlertTriangle, CheckCircle } from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import { EnhancedBufferVisualizer } from "@/components/inventory/buffer/EnhancedBufferVisualizer";

interface EnhancedInventoryTabProps {
  paginatedData: InventoryItem[];
  onCreatePO: (item: InventoryItem) => void;
  onRefresh: () => Promise<void>;
  onSelectItem?: (item: InventoryItem) => void;
}

export function EnhancedInventoryTab({ 
  paginatedData, 
  onCreatePO, 
  onRefresh,
  onSelectItem 
}: EnhancedInventoryTabProps) {
  
  // Calculate buffer zones for visualization (sample calculation)
  const calculateBufferZones = (item: InventoryItem) => {
    const leadTime = item.leadTimeDays || 10;
    const adu = item.adu || 5;
    const variability = item.variabilityFactor || 0.5;
    
    return {
      red: Math.round(adu * leadTime * variability),
      yellow: Math.round(adu * leadTime * 0.5),
      green: Math.round(adu * leadTime * 0.5 * 0.7)
    };
  };

  return (
    <div className="space-y-4">
      <div className="px-6 py-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>On Hand</TableHead>
              <TableHead>Buffer Status</TableHead>
              <TableHead>Decoupling</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => {
                const bufferZones = calculateBufferZones(item);
                const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
                const netFlowPosition = item.quantity_on_hand || 0;
                const bufferPenetration = totalBuffer > 0 
                  ? Math.max(0, Math.min(100, ((totalBuffer - netFlowPosition) / totalBuffer) * 100)) 
                  : 0;
                
                return (
                  <TableRow 
                    key={item.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectItem && onSelectItem(item)}
                  >
                    <TableCell className="font-medium">{item.sku || item.product_id}</TableCell>
                    <TableCell>{item.name || "-"}</TableCell>
                    <TableCell>{item.location || item.location_id}</TableCell>
                    <TableCell>{item.quantity_on_hand}</TableCell>
                    <TableCell>
                      <div className="w-40">
                        <EnhancedBufferVisualizer 
                          bufferZones={bufferZones}
                          netFlowPosition={netFlowPosition}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.decoupling_point ? (
                        <Badge className="bg-blue-100 text-blue-800">Decoupling Point</Badge>
                      ) : (
                        <Badge variant="outline">Regular</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreatePO(item);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Create PO
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No inventory items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
