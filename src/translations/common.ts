
import { CommonTranslations } from './types';
import { uiTranslations } from './common/ui';
import { inventoryTranslations } from './common/inventory';
import { moduleTranslations } from './common/modules';
import { chartTranslations } from './common/charts';
import { paginationTranslations } from './common/pagination';

export const commonTranslations: CommonTranslations = {
  // UI translations
  ...uiTranslations,
  
  // Inventory translations
  inventoryTitle: inventoryTranslations.inventoryTitle,
  bufferZones: inventoryTranslations.bufferZones,
  skuClassification: inventoryTranslations.skuClassification,
  leadTime: inventoryTranslations.leadTime,
  replenishmentOrders: inventoryTranslations.replenishmentOrders,
  bufferStatus: inventoryTranslations.bufferStatus,
  netFlowPosition: inventoryTranslations.netFlowPosition,
  inventorySummary: inventoryTranslations.inventorySummary,
  
  // Chart translations
  chartTitles: chartTranslations.chartTitles,
  zones: chartTranslations.zones,
  
  // Pagination translations
  next: paginationTranslations.next,
  previous: paginationTranslations.previous,
  page: paginationTranslations.page,
  of: paginationTranslations.of,
  perPage: paginationTranslations.perPage,
  items: paginationTranslations.items,
  showing: paginationTranslations.showing,
  to: paginationTranslations.to,
  
  // Module translations
  ...moduleTranslations
};
