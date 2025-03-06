
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { BufferStatusBadge } from "./BufferStatusBadge";
import { BufferVisualizer } from "./BufferVisualizer";
import { CreatePODialog } from "./CreatePODialog";
import { InventoryItem } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";

// Simplified buffer calculation functions for fallback
const simplifiedCalculateBufferZones = (item: InventoryItem) => {
  const redZone = item.redZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * (item.leadTimeDays * 0.33)) : 0);
  const yellowZone = item.yellowZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * item.leadTimeDays) : 0);
  const greenZone = item.greenZoneSize || (item.adu && item.leadTimeDays ? Math.round(item.adu * (item.leadTimeDays * 0.5)) : 0);
  
  return { red: redZone, yellow: yellowZone, green: greenZone };
};

const simplifiedCalculateNetFlowPosition = (item: InventoryItem) => {
  const onHand = item.onHand || 0;
  const onOrder = item.onOrder || 0;
  const qualifiedDemand = item.qualifiedDemand || 0;
  const netFlowPosition = onHand + onOrder - qualifiedDemand;
  
  return { onHand, onOrder, qualifiedDemand, netFlowPosition };
};

const simplifiedCalculateBufferPenetration = (netFlowPosition: number, bufferZones: { red: number; yellow: number; green: number; }) => {
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  const penetration = totalBuffer > 0 ? ((totalBuffer - netFlowPosition) / totalBuffer) * 100 : 0;
  return Math.max(0, Math.min(100, penetration));
};

const simplifiedGetBufferStatus = (bufferPenetration: number): 'green' | 'yellow' | 'red' => {
  if (bufferPenetration <= 33) return 'green';
  if (bufferPenetration <= 66) return 'yellow';
  return 'red';
};

interface InventoryTabProps {
  paginatedData: InventoryItem[];
  onCreatePO: (item: InventoryItem) => void;
}

export const InventoryTab = ({ paginatedData, onCreatePO }: InventoryTabProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [itemBuffers, setItemBuffers] = useState<Record<string, {
    bufferZones: { red: number; yellow: number; green: number; };
    netFlow: { netFlowPosition: number; onHand: number; onOrder: number; qualifiedDemand: number; };
    bufferPenetration: number;
    status: 'green' | 'yellow' | 'red';
  }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBufferData = () => {
      try {
        const bufferData: Record<string, any> = {};
        
        for (const item of paginatedData) {
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
      } catch (error) {
        console.error("Error calculating buffer data:", error);
        toast({
          title: "Calculation Error",
          description: "There was an error calculating buffer data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBufferData();
  }, [paginatedData, toast]);

  if (loading) {
    return <div className="p-6 text-center">Loading inventory data...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {paginatedData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No inventory items available.</p>
        </div>
      ) : (
        paginatedData.map((item) => {
          const bufferData = itemBuffers[item.id];
          
          if (!bufferData) {
            return <div key={item.id} className="text-muted-foreground">Loading item data...</div>;
          }

          return (
            <div key={item.id} className="space-y-4">
              <Table>
                <InventoryTableHeader />
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.onHand}</TableCell>
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
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.productFamily}</TableCell>
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
