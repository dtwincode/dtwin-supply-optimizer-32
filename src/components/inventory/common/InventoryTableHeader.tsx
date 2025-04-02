
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useI18n } from '@/contexts/I18nContext';

export const InventoryTableHeader = () => {
  const { t } = useI18n();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{t("common.inventory.sku")}</TableHead>
        <TableHead>{t("common.inventory.name")}</TableHead>
        <TableHead>{t("common.inventory.onHand")}</TableHead>
        <TableHead>{t("common.inventory.status")}</TableHead>
        <TableHead>{t("common.inventory.buffer")}</TableHead>
        <TableHead>{t("common.inventory.location")}</TableHead>
        <TableHead>{t("common.inventory.family")}</TableHead>
        <TableHead>{t("common.inventory.leadTime")}</TableHead>
        <TableHead>{t("common.inventory.variability")}</TableHead>
        <TableHead>{t("common.inventory.criticality")}</TableHead>
        <TableHead>{t("common.inventory.penetration")}</TableHead>
        <TableHead>{t("common.inventory.actions")}</TableHead>
      </TableRow>
    </TableHeader>
  );
};
