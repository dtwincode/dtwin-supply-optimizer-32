
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

interface InventoryTabProps {
  paginatedData: InventoryItem[];
  onCreatePO: (item: InventoryItem) => void;
}

export const InventoryTab = ({ paginatedData, onCreatePO }: InventoryTabProps) => {
  const { language } = useLanguage();

  return (
    <div className="p-6">
      <Table>
        <InventoryTableHeader />
        <TableBody>
          {paginatedData.map((item) => {
            const bufferZones = calculateBufferZones(item);
            const netFlow = calculateNetFlowPosition(item);
            const bufferPenetration = calculateBufferPenetration(netFlow.netFlowPosition, bufferZones);
            const status = getBufferStatus(bufferPenetration);

            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.onHand}</TableCell>
                <TableCell>
                  <BufferStatusBadge status={status} />
                </TableCell>
                <TableCell>
                  <BufferVisualizer 
                    netFlowPosition={netFlow.netFlowPosition}
                    bufferZones={bufferZones}
                  />
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.productFamily}</TableCell>
                <TableCell>
                  <CreatePODialog 
                    item={item}
                    bufferZones={bufferZones}
                    onSuccess={() => onCreatePO(item)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
