
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

export const InventoryTableHeader = () => {
  const { language } = useLanguage();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{getTranslation("common.sku", language)}</TableHead>
        <TableHead>{getTranslation("common.name", language)}</TableHead>
        <TableHead>{getTranslation("common.currentStock", language)}</TableHead>
        <TableHead>{getTranslation("common.bufferZone", language)}</TableHead>
        <TableHead>{getTranslation("common.location", language)}</TableHead>
        <TableHead>{getTranslation("common.productFamily", language)}</TableHead>
        <TableHead>{getTranslation("common.actions", language)}</TableHead>
      </TableRow>
    </TableHeader>
  );
};
