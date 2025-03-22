
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIndustry } from "@/contexts/IndustryContext";
import { getTranslation } from "@/translations";
import { getIndustrySpecificColumns } from "@/utils/inventoryPageUtils";

export const InventoryTableHeader = () => {
  const { language } = useLanguage();
  const { selectedIndustry } = useIndustry();
  
  const industryColumns = getIndustrySpecificColumns(selectedIndustry);
  const hasIndustrySpecificColumns = industryColumns.length > 5; // More than common columns
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{getTranslation("common.inventory.sku", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.name", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.currentStock", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.bufferStatus", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.bufferZones", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.location", language)}</TableHead>
        <TableHead>{getTranslation("common.inventory.productFamily", language)}</TableHead>
        
        {/* Industry-specific columns */}
        {hasIndustrySpecificColumns && 
          industryColumns.slice(5).map(column => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))
        }
        
        <TableHead>{getTranslation("common.inventory.actions", language)}</TableHead>
      </TableRow>
    </TableHeader>
  );
};
