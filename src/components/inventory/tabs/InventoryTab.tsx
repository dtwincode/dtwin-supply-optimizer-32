
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

const calculateBufferZones = (item: InventoryItem): BufferZones => {
  try {
    // Use values directly from inventory_planning_view if available
    if (item.safety_stock && item.min_stock_level) {
      const redZone = Math.round(item.safety_stock);
      const yellowZone = Math.round(item.min_stock_level - item.safety_stock);
      const greenZone = Math.round(item.max_stock_level ? item.max_stock_level - item.min_stock_level : yellowZone * 0.5);
      
      return { red: redZone, yellow: yellowZone, green: greenZone };
    }
    
    // Fallback to calculation if planning view fields aren't available
    const adu = item.adu || item.average_daily_usage || 0;
    const leadTimeDays = item.leadTimeDays || item.lead_time_days || 0;
    
    if (!adu || !leadTimeDays) {
      return { red: 0, yellow: 0, green: 0 };
    }
    
    const redZone = Math.round(adu * (leadTimeDays * 0.33));
    const yellowZone = Math.round(adu * leadTimeDays);
    const greenZone = Math.round(adu * (leadTimeDays * 0.5));
    
    return { red: redZone, yellow: yellowZone, green: greenZone };
  } catch (error) {
    console.error("Error calculating buffer zones:", error);
    return { red: 0, yellow: 0, green: 0 };
  }
};

const calculateNetFlowPosition = (item: InventoryItem): NetFlowPosition => {
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

const calculateBufferPenetration = (netFlowPosition: number, bufferZones: BufferZones): number => {
  try {
    const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
    if (totalBuffer <= 0) return 0;
    
    const penetration = ((totalBuffer - netFlowPosition) / totalBuffer) * 100;
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
          
          const uniqueKey = item.id || `${item.product_id}-${item.location_id}`;
          const bufferZones = calculateBufferZones(item);
          const netFlow = calculateNetFlowPosition(item);
          const bufferPenetration = calculateBufferPenetration(netFlow.netFlowPosition, bufferZones);
          const status = getBufferStatus(bufferPenetration);
          
          bufferData[uniqueKey] = {
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

      {!paginatedData || paginatedData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">{t("common.inventory.noItems")}</p>
        </div>
      ) : (
        paginatedData.map((item) => {
          const uniqueKey = item.id || `${item.product_id}-${item.location_id}`;
          if (!uniqueKey) {
            return null;
          }
          
          const bufferData = itemBuffers[uniqueKey];
          
          if (!bufferData) {
            return <div key={uniqueKey} className="text-muted-foreground">{t("common.inventory.loadingItem")}</div>;
          }

          // Create classification from lead time and variability data
          const leadTimeCategory = item.lead_time_days && item.lead_time_days > 30 
            ? "long" 
            : item.lead_time_days && item.lead_time_days > 15 
            ? "medium" 
            : "short";
            
          const variabilityLevel = item.demand_variability && item.demand_variability > 1 
            ? "high" 
            : item.demand_variability && item.demand_variability > 0.5 
            ? "medium" 
            : "low";
            
          const criticality = item.decoupling_point ? "high" : "low";
          
          const classification: Classification = {
            leadTimeCategory,
            variabilityLevel,
            criticality,
            score: item.max_stock_level || 0
          };

          return (
            <div key={uniqueKey} className="space-y-4">
              <Table>
                <InventoryTableHeader />
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{item.sku || item.product_id || "N/A"}</TableCell>
                    <TableCell>{item.name || item.product_id || "N/A"}</TableCell>
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
                    <TableCell>{item.location || item.location_id || "N/A"}</TableCell>
                    <TableCell>{item.productFamily || "N/A"}</TableCell>
                    <TableCell>{classification.leadTimeCategory || "N/A"}</TableCell>
                    <TableCell>{classification.variabilityLevel || "N/A"}</TableCell>
                    <TableCell>{classification.criticality || "N/A"}</TableCell>
                    <TableCell>{classification.score ?? "N/A"}</TableCell>
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
