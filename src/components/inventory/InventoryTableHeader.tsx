
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/contexts/I18nContext";

export function InventoryTableHeader() {
  const { t } = useI18n();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">{t("common.inventory.sku")}</TableHead>
        <TableHead>{t("common.inventory.name")}</TableHead>
        <TableHead>{t("common.inventory.onHand")}</TableHead>
        <TableHead>{t("common.inventory.status")}</TableHead>
        <TableHead className="w-[300px]">{t("common.inventory.buffer")}</TableHead>
        <TableHead>{t("common.inventory.location")}</TableHead>
        <TableHead>{t("common.inventory.productFamily")}</TableHead>
        <TableHead>{t("common.inventory.leadTime")}</TableHead>
        <TableHead>{t("common.inventory.variability")}</TableHead>
        <TableHead>{t("common.inventory.criticality")}</TableHead>
        <TableHead>{t("common.inventory.score")}</TableHead>
        <TableHead className="text-right">{t("common.inventory.actions")}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
