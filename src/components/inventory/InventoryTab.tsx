
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { BufferStatusBadge } from "./BufferStatusBadge";
import { BufferVisualizer } from "./BufferVisualizer";
import { CreatePODialog } from "./CreatePODialog";
import { 
  calculateBufferZones,
  calculateNetFlowPosition,
  calculateBufferPenetration,
  getBufferStatus 
} from "@/utils/inventoryUtils";
import { InventoryItem } from "@/types/inventory";
import { useEffect, useState } from "react";

interface InventoryTabProps {
  paginatedData: InventoryItem[];
  onCreatePO: (item: InventoryItem) => void;
}

export const InventoryTab = ({ paginatedData, onCreatePO }: InventoryTabProps) => {
  const { language } = useLanguage();
  const [itemBuffers, setItemBuffers] = useState<Record<string, {
    bufferZones: { red: number; yellow: number; green: number; };
    netFlow: { netFlowPosition: number; onHand: number; onOrder: number; qualifiedDemand: number; };
    bufferPenetration: number;
    status: 'green' | 'yellow' | 'red';
  }>>({});

  useEffect(() => {
    const loadBufferData = async () => {
      const bufferData: Record<string, any> = {};
      
      for (const item of paginatedData) {
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

    loadBufferData();
  }, [paginatedData]);

  return (
    <div className="space-y-6 p-6">
      {paginatedData.map((item) => {
        const bufferData = itemBuffers[item.id];
        
        if (!bufferData) return null; // Skip rendering until buffer data is loaded

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
      })}
    </div>
  );
};
