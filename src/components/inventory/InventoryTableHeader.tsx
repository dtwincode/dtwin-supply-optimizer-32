
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

export const InventoryTableHeader = () => {
  const { language } = useLanguage();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{getTranslation("common.inventory.sku", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.name", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.currentStock", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.bufferZones", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.location", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.productFamily", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.actions", language)}</TableHead>
      </TableRow>
    </TableHeader>
  );
};
