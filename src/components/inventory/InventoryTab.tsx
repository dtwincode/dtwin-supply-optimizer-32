
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/contexts/I18nContext";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { BufferStatusBadge } from "./BufferStatusBadge";
import { BufferVisualizer } from "./BufferVisualizer";
import { CreatePODialog } from "./CreatePODialog";
import { InventoryItem } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";

// Simplified buffer calculation functions for fallback
const simplifiedCalculateBufferZones = (item: InventoryItem) => {
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

const simplifiedCalculateNetFlowPosition = (item: InventoryItem) => {
  try {
    const onHand = item.onHand || 0;
    const onOrder = item.onOrder || 0;
    const qualifiedDemand = item.qualifiedDemand || 0;
    const netFlowPosition = onHand + onOrder - qualifiedDemand;
    
    return { onHand, onOrder, qualifiedDemand, netFlowPosition };
  } catch (error) {
    console.error("Error calculating net flow position:", error);
    return { onHand: 0, onOrder: 0, qualifiedDemand: 0, netFlowPosition: 0 };
  }
};

const simplifiedCalculateBufferPenetration = (netFlowPosition: number, bufferZones: { red: number; yellow: number; green: number; }) => {
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
}

export const InventoryTab = ({ paginatedData, onCreatePO }: InventoryTabProps) => {
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
    // Use a short timeout to allow the component to mount properly
    const timer = setTimeout(() => {
      loadBufferData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [paginatedData, toast, t]);

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
      {!paginatedData || paginatedData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">{t("common.inventory.noItems")}</p>
        </div>
      ) : (
        paginatedData.map((item) => {
          if (!item || !item.id) {
            return null;
          }
          
          const bufferData = itemBuffers[item.id];
          
          if (!bufferData) {
            return <div key={item.id} className="text-muted-foreground">{t("common.inventory.loadingItem")}</div>;
          }

          return (
            <div key={item.id} className="space-y-4">
              <Table>
                <InventoryTableHeader />
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{item.sku || "N/A"}</TableCell>
                    <TableCell>{item.name || "N/A"}</TableCell>
                    <TableCell>{typeof item.onHand === 'number' ? item.onHand : "N/A"}</TableCell>
                    <TableCell>
                      <BufferStatusBadge status={bufferData.status} />
                    </TableCell>
                    <TableCell>
                      <BufferVisualizer 
                        netFlowPosition={bufferData.netFlow.netFlowPosition}
                        bufferZones={bufferData.bufferZones}
                        adu={item.adu}
                      />
                    </TableCell>
                    <TableCell>{item.location || "N/A"}</TableCell>
                    <TableCell>{item.productFamily || "N/A"}</TableCell>
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
