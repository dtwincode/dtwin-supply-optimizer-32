
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/contexts/I18nContext";

export const InventoryTableHeader = () => {
  const { t } = useI18n();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{t("common.inventory.sku")}</TableHead>
        <TableHead>{t("common.inventory.name")}</TableHead>
        <TableHead>{t("common.inventory.currentStock")}</TableHead>
        <TableHead>{t("common.inventory.bufferStatus")}</TableHead>
        <TableHead>{t("common.inventory.bufferZones")}</TableHead>
        <TableHead>{t("common.inventory.location")}</TableHead>
        <TableHead>{t("common.inventory.productFamily")}</TableHead>
        <TableHead>{t("common.inventory.actions")}</TableHead>
      </TableRow>
    </TableHeader>
  );
};
