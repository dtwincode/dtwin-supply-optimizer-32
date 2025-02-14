
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

export const InventoryTableHeader = () => {
  const { language } = useLanguage();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{getTranslation("inventory.sku", language)}</TableHead>
        <TableHead>{getTranslation("inventory.name", language)}</TableHead>
        <TableHead>{getTranslation("inventory.currentStock", language)}</TableHead>
        <TableHead>{getTranslation("inventory.bufferZone", language)}</TableHead>
        <TableHead>{getTranslation("inventory.location", language)}</TableHead>
        <TableHead>{getTranslation("inventory.productFamily", language)}</TableHead>
        <TableHead>{getTranslation("inventory.actions", language)}</TableHead>
      </TableRow>
    </TableHeader>
  );
};
