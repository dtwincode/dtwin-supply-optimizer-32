
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryTableHeader } from "../InventoryTableHeader";
import { BufferStatusBadge } from "../BufferStatusBadge";
import { BufferVisualizer } from "../BufferVisualizer";
import { CreatePODialog } from "../CreatePODialog";
import { InventoryItem, Classification } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { InventoryInsightsCard } from "../InventoryInsightsCard";

interface BufferZones {
  red: number;
  yellow: number;
  green: number;
}

interface NetFlowPosition {
  onHand: number;
  onOrder: number;
  qualifiedDemand: number;
  netFlowPosition: number;
}

const simplifiedCalculateBufferZones = (item: InventoryItem): BufferZones => {
  try {
    // First try to use fields from inventory_planning_view
    if (item.min_stock_level && item.safety_stock) {
      // In DDMRP terminology:
      // Red Zone = safety_stock
      // Yellow Zone = min_stock_level (~ replenishment zone)
      // Green Zone is often calculated as a portion of yellow zone
      const redZone = Math.round(item.safety_stock);
      const yellowZone = Math.round(item.min_stock_level);
      const greenZone = Math.round(yellowZone * 0.5); // If not available, estimate as 50% of yellow zone
      
      return { red: redZone, yellow: yellowZone, green: greenZone };
    }
    
    // Fallback to legacy calculation if planning view fields aren't available
    const redZone = item.redZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * (item.leadTimeDays * 0.33)) : 0);
    const yellowZone = item.yellowZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * item.leadTimeDays) : 0);
    const greenZone = item.greenZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * (item.leadTimeDays * 0.5)) : 0);
    
    return { red: redZone, yellow: yellowZone, green: greenZone };
  } catch (error) {
    console.error("Error calculating buffer zones:", error);
    return { red: 0, yellow: 0, green: 0 };
  }
};

const simplifiedCalculateNetFlowPosition = (item: InventoryItem): NetFlowPosition => {
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

const simplifiedCalculateBufferPenetration = (netFlowPosition: number, bufferZones: { red: number; yellow: number; green: number; }): number => {
  try {
    const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
    const penetration = totalBuffer > 0 ? ((totalBuffer - netFlowPosition) / totalBuffer) * 100 : 0;
    return Math.max(0, Math.min(100, penetration));
  } catch (error) {
    console.error("Error calculating buffer penetration:", error);
    return 0;
  }
};

const simplifiedGetBufferStatus = (bufferPenetration: number): 'green' | 'yellow' | 'red' => {
  try {
    if (bufferPenetration <= 33) return 'green';
    if (bufferPenetration <= 66) return 'yellow';
    return 'red';
  } catch (error) {
    console.error("Error determining buffer status:", error);
    return 'green';
  }
};

interface InventoryTabProps {
  paginatedData: InventoryItem[];
  onCreatePO: (item: InventoryItem) => void;
  onRefresh?: () => Promise<void>;
}

export const InventoryTab = ({ paginatedData, onCreatePO, onRefresh }: InventoryTabProps) => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [itemBuffers, setItemBuffers] = useState<Record<string, {
    bufferZones: BufferZones;
    netFlow: NetFlowPosition;
    bufferPenetration: number;
    status: 'green' | 'yellow' | 'red';
  }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
          
          const bufferZones = simplifiedCalculateBufferZones(item);
          const netFlow = simplifiedCalculateNetFlowPosition(item);
          const bufferPenetration = simplifiedCalculateBufferPenetration(netFlow.netFlowPosition, bufferZones);
          const status = simplifiedGetBufferStatus(bufferPenetration);
          
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
      <div className="flex justify-end mb-4">
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

      <InventoryInsightsCard />

      {!paginatedData || paginatedData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">{t("common.inventory.noItems")}</p>
        </div>
      ) : (
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
            <div key={itemId} className="space-y-4">
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
                      <BufferVisualizer 
                        netFlowPosition={bufferData.netFlow.netFlowPosition}
                        bufferZones={bufferData.bufferZones}
                        adu={item.adu || item.average_daily_usage}
                      />
                    </TableCell>
                    <TableCell>{item.location || "N/A"}</TableCell>
                    <TableCell>{item.productFamily || "N/A"}</TableCell>
                    <TableCell>{item.classification?.leadTimeCategory || "N/A"}</TableCell>
                    <TableCell>{item.classification?.variabilityLevel || "N/A"}</TableCell>
                    <TableCell>{item.classification?.criticality || "N/A"}</TableCell>
                    <TableCell>{item.classification?.score ?? "N/A"}</TableCell>
                    <TableCell>
                      <CreatePODialog 
                        item={item}
                        bufferZones={bufferData.bufferZones}
                        onSuccess={() => onCreatePO(item)}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          );
        })
      )}
    </div>
  );
};
