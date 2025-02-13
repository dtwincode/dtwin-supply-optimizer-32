
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

export const InventoryTableHeader = () => {
  const { language } = useLanguage();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{getTranslation("sku", language)}</TableHead>
        <TableHead>{getTranslation("name", language)}</TableHead>
        <TableHead>{getTranslation("currentStock", language)}</TableHead>
        <TableHead>{getTranslation("bufferZone", language)}</TableHead>
        <TableHead>{getTranslation("location", language)}</TableHead>
        <TableHead>{getTranslation("productFamily", language)}</TableHead>
        <TableHead>{getTranslation("actions", language)}</TableHead>
      </TableRow>
    </TableHeader>
  );
};
