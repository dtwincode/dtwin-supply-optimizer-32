
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { BufferStatusBadge } from "./BufferStatusBadge";
import { calculateBufferStatus } from "@/utils/inventoryUtils";
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
          {paginatedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.currentStock}</TableCell>
              <TableCell>
                <BufferStatusBadge status={calculateBufferStatus(item.netFlow)} />
              </TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{item.productFamily}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCreatePO(item)}
                >
                  {getTranslation("common.createPO", language)}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
