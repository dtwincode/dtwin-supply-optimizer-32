
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle, 
  Filter,
  BarChart3
} from "lucide-react";
import { InventoryItem } from "@/types/inventory";
import { EnhancedBufferVisualizer } from "@/components/inventory/buffer/EnhancedBufferVisualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  
  // Calculate buffer zones for visualization
  const calculateBufferZones = (item: InventoryItem) => {
    const leadTime = item.leadTimeDays || 10;
    const adu = item.adu || 5;
    const variabilityFactor = item.variabilityFactor || 0.5;
    
    return {
      red: Math.round(adu * leadTime * variabilityFactor),
      yellow: Math.round(adu * leadTime * 0.5),
      green: Math.round(adu * leadTime * 0.5 * 0.7)
    };
  };

  // Calculate buffer penetration percentage for color coding
  const getBufferStatus = (penetration: number): { color: string; status: string } => {
    if (penetration >= 80) {
      return { color: "bg-red-500", status: "Critical" };
    } else if (penetration >= 40) {
      return { color: "bg-yellow-500", status: "Warning" };
    } else {
      return { color: "bg-green-500", status: "Healthy" };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === "table" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("table")}
          >
            <Filter className="h-4 w-4 mr-1" />
            Table View
          </Button>
          <Button 
            variant={viewMode === "cards" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setViewMode("cards")}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Card View
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh Data
        </Button>
      </div>

      {viewMode === "table" ? (
        <div className="bg-card rounded-md border shadow">
          <div className="px-4 py-3 border-b">
            <h3 className="text-lg font-medium">Inventory Items</h3>
          </div>
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
                  const netFlowPosition = item.onHand || 0;
                  const bufferPenetration = totalBuffer > 0 
                    ? Math.max(0, Math.min(100, ((totalBuffer - netFlowPosition) / totalBuffer) * 100)) 
                    : 0;
                  
                  const bufferStatus = getBufferStatus(bufferPenetration);
                  
                  return (
                    <TableRow 
                      key={item.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onSelectItem && onSelectItem(item)}
                    >
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.name || "-"}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.onHand}</TableCell>
                      <TableCell>
                        <div className="w-40">
                          <EnhancedBufferVisualizer 
                            bufferZones={bufferZones}
                            netFlowPosition={netFlowPosition}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.decouplingPointId ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => {
              const bufferZones = calculateBufferZones(item);
              const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
              const netFlowPosition = item.onHand || 0;
              const bufferPenetration = totalBuffer > 0 
                ? Math.max(0, Math.min(100, ((totalBuffer - netFlowPosition) / totalBuffer) * 100)) 
                : 0;
              
              const bufferStatus = getBufferStatus(bufferPenetration);
              
              return (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onSelectItem && onSelectItem(item)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{item.sku}</CardTitle>
                        <p className="text-sm text-muted-foreground">{item.name || "-"}</p>
                      </div>
                      {item.decouplingPointId ? (
                        <Badge className="bg-blue-100 text-blue-800">Decoupling Point</Badge>
                      ) : (
                        <Badge variant="outline">Regular</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-muted/50 p-2 rounded">
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-medium">{item.location}</p>
                      </div>
                      <div className="bg-muted/50 p-2 rounded">
                        <p className="text-xs text-muted-foreground">On Hand</p>
                        <p className="font-medium">{item.onHand}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Buffer Status</p>
                      <EnhancedBufferVisualizer 
                        bufferZones={bufferZones}
                        netFlowPosition={netFlowPosition}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreatePO(item);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Create PO
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-8 text-muted-foreground border rounded-md">
              No inventory items found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
