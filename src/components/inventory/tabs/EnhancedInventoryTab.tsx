
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryTableHeader } from "../InventoryTableHeader";
import { BufferStatusBadge } from "../BufferStatusBadge";
import { CreatePODialog } from "../CreatePODialog";
import { InventoryItem } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, Filter } from "lucide-react";
import { InventoryPlanningInsights } from "../InventoryPlanningInsights";
import { EnhancedBufferVisualizer } from "../buffer/EnhancedBufferVisualizer";
import { DecouplingAnalytics } from "../decoupling/DecouplingAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Simplified calculation functions
const calculateBufferZones = (item: InventoryItem) => {
  try {
    const redZone = item.redZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * (item.leadTimeDays * 0.33)) : 0);
    const yellowZone = item.yellowZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * item.leadTimeDays) : 0);
    const greenZone = item.greenZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * (item.leadTimeDays * 0.5)) : 0);
    
    return { red: redZone, yellow: yellowZone, green: greenZone };
  } catch (error) {
    console.error("Error calculating buffer zones:", error);
    return { red: 0, yellow: 0, green: 0 };
  }
};

const calculateNetFlowPosition = (item: InventoryItem) => {
  try {
    const onHand = item.onHand || item.quantity_on_hand || 0;
    const onOrder = item.onOrder || 0;
    const qualifiedDemand = item.qualifiedDemand || 0;
    const netFlowPosition = onHand + onOrder - qualifiedDemand;
    
    return { onHand, onOrder, qualifiedDemand, netFlowPosition };
  } catch (error) {
    console.error("Error calculating net flow position:", error);
    return { onHand: 0, onOrder: 0, qualifiedDemand: 0, netFlowPosition: 0 };
  }
};

const calculateBufferPenetration = (netFlowPosition: number, bufferZones: { red: number; yellow: number; green: number; }) => {
  try {
    const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
    const penetration = totalBuffer > 0 ? ((totalBuffer - netFlowPosition) / totalBuffer) * 100 : 0;
    return Math.max(0, Math.min(100, penetration));
  } catch (error) {
    console.error("Error calculating buffer penetration:", error);
    return 0;
  }
};

const getBufferStatus = (bufferPenetration: number): 'green' | 'yellow' | 'red' => {
  try {
    if (bufferPenetration <= 33) return 'green';
    if (bufferPenetration <= 66) return 'yellow';
    return 'red';
  } catch (error) {
    console.error("Error determining buffer status:", error);
    return 'green';
  }
};

interface EnhancedInventoryTabProps {
  paginatedData: InventoryItem[];
  onCreatePO: (item: InventoryItem) => void;
  onRefresh?: () => Promise<void>;
}

export const EnhancedInventoryTab = ({ paginatedData, onCreatePO, onRefresh }: EnhancedInventoryTabProps) => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [itemBuffers, setItemBuffers] = useState<Record<string, {
    bufferZones: { red: number; yellow: number; green: number; };
    netFlow: { netFlowPosition: number; onHand: number; onOrder: number; qualifiedDemand: number; };
    bufferPenetration: number;
    status: 'green' | 'yellow' | 'red';
  }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'analytics'>('table');

  useEffect(() => {
    const loadBufferData = () => {
      try {
        if (!paginatedData || paginatedData.length === 0) {
          setItemBuffers({});
          setLoading(false);
          return;
        }
        
        const bufferData: Record<string, any> = {};
        
        for (const item of paginatedData) {
          if (!item || !item.id) continue;
          
          const bufferZones = calculateBufferZones(item);
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
        setError(null);
      } catch (error) {
        console.error("Error calculating buffer data:", error);
        setError("Failed to load buffer data");
        toast({
          title: t("common.error"),
          description: t("common.inventory.errorLoading"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    const timer = setTimeout(() => {
      loadBufferData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [paginatedData, toast, t]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        toast({
          title: "Data refreshed",
          description: "Inventory data has been updated.",
        });
      } catch (error) {
        toast({
          title: "Refresh failed",
          description: "Could not refresh inventory data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center">{t("common.inventory.loadingData")}</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button 
            variant={viewMode === 'analytics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('analytics')}
          >
            Analytics View
          </Button>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Show All Items</DropdownMenuItem>
              <DropdownMenuItem>Only Decoupling Points</DropdownMenuItem>
              <DropdownMenuItem>Red Status Items</DropdownMenuItem>
              <DropdownMenuItem>Yellow Status Items</DropdownMenuItem>
              <DropdownMenuItem>Green Status Items</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InventoryPlanningInsights selectedItem={selectedItem || undefined} />
          <DecouplingAnalytics items={paginatedData} />
        </div>
      )}

      {!paginatedData || paginatedData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">{t("common.inventory.noItems")}</p>
        </div>
      ) : viewMode === 'table' ? (
        paginatedData.map((item) => {
          const itemId = item.id || "";
          if (!itemId) {
            return null;
          }
          
          const bufferData = itemBuffers[itemId];
          
          if (!bufferData) {
            return <div key={itemId} className="text-muted-foreground">{t("common.inventory.loadingItem")}</div>;
          }

          return (
            <Card key={itemId} className="mb-4">
              <CardContent className="p-0">
                <Table>
                  <InventoryTableHeader />
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{item.sku || item.product_id || "N/A"}</TableCell>
                      <TableCell>{item.name || "N/A"}</TableCell>
                      <TableCell>{typeof item.onHand === 'number' ? item.onHand : (typeof item.quantity_on_hand === 'number' ? item.quantity_on_hand : "N/A")}</TableCell>
                      <TableCell>
                        <BufferStatusBadge status={bufferData.status} />
                      </TableCell>
                      <TableCell>
                        <EnhancedBufferVisualizer 
                          netFlowPosition={bufferData.netFlow.netFlowPosition}
                          bufferZones={bufferData.bufferZones}
                          adu={item.adu}
                        />
                      </TableCell>
                      <TableCell>{item.location || "N/A"}</TableCell>
                      <TableCell>{item.productFamily || "N/A"}</TableCell>
                      <TableCell>{item.classification?.leadTimeCategory || "N/A"}</TableCell>
                      <TableCell>{item.classification?.variabilityLevel || "N/A"}</TableCell>
                      <TableCell>{item.classification?.criticality || "N/A"}</TableCell>
                      <TableCell>{item.classification?.score ?? "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Inventory Item Details</DialogTitle>
                                <DialogDescription>
                                  Detailed analytical view of {item.name || item.sku || item.product_id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="border rounded p-3 bg-muted/30">
                                      <p className="text-xs text-muted-foreground">SKU</p>
                                      <p className="font-medium">{item.sku || item.product_id}</p>
                                    </div>
                                    <div className="border rounded p-3 bg-muted/30">
                                      <p className="text-xs text-muted-foreground">On Hand</p>
                                      <p className="font-medium">{item.onHand || item.quantity_on_hand || 0}</p>
                                    </div>
                                    <div className="border rounded p-3 bg-muted/30">
                                      <p className="text-xs text-muted-foreground">ADU</p>
                                      <p className="font-medium">{item.adu || "N/A"}</p>
                                    </div>
                                    <div className="border rounded p-3 bg-muted/30">
                                      <p className="text-xs text-muted-foreground">Lead Time</p>
                                      <p className="font-medium">{item.leadTimeDays || "N/A"} days</p>
                                    </div>
                                  </div>
                                  
                                  <div className="border rounded p-4">
                                    <h3 className="text-sm font-medium mb-2">Buffer Status</h3>
                                    <EnhancedBufferVisualizer 
                                      netFlowPosition={bufferData.netFlow.netFlowPosition}
                                      bufferZones={bufferData.bufferZones}
                                      adu={item.adu}
                                      showDetailedInfo={true}
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div className="border rounded p-4">
                                    <h3 className="text-sm font-medium mb-2">Product Classification</h3>
                                    <div className="grid grid-cols-3 gap-3 mt-2">
                                      <div>
                                        <p className="text-xs text-muted-foreground">Lead Time</p>
                                        <p className="font-medium capitalize">{item.classification?.leadTimeCategory || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Variability</p>
                                        <p className="font-medium capitalize">{item.classification?.variabilityLevel || "N/A"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Criticality</p>
                                        <p className="font-medium capitalize">{item.classification?.criticality || "N/A"}</p>
                                      </div>
                                    </div>
                                    <div className="mt-3">
                                      <p className="text-xs text-muted-foreground">Classification Score</p>
                                      <div className="w-full bg-muted h-2 rounded-full mt-1">
                                        <div 
                                          className="bg-primary h-2 rounded-full" 
                                          style={{ width: `${item.classification?.score || 0}%` }}
                                        ></div>
                                      </div>
                                      <div className="flex justify-between text-xs mt-1">
                                        <span>0</span>
                                        <span>{item.classification?.score || 0}/100</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="border rounded p-4">
                                    <h3 className="text-sm font-medium mb-2">Decoupling Status</h3>
                                    <div className="mb-2">
                                      <p className="text-xs text-muted-foreground">Status</p>
                                      {item.decoupling_point ? (
                                        <div className="flex items-center mt-1">
                                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                          <p className="font-medium">Decoupling Point</p>
                                        </div>
                                      ) : (
                                        <div className="flex items-center mt-1">
                                          <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                                          <p className="font-medium">Regular Point</p>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {item.decoupling_point 
                                        ? "This is a strategic decoupling point positioned to protect against variability." 
                                        : "This is a regular inventory point that follows standard replenishment rules."}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    // This would typically navigate to a detailed analysis page
                                    toast({
                                      description: "Full analysis view not implemented in this example"
                                    });
                                  }}
                                >
                                  View Full Analysis
                                </Button>
                                <CreatePODialog 
                                  item={item}
                                  bufferZones={bufferData.bufferZones}
                                  onSuccess={() => onCreatePO(item)}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <CreatePODialog 
                            item={item}
                            bufferZones={bufferData.bufferZones}
                            onSuccess={() => onCreatePO(item)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })
      ) : null}
    </div>
  );
};
