
import { CommonTranslations } from './types';
import { uiTranslations } from './common/ui';
import { inventoryTranslations } from './common/inventory';
import { moduleTranslations } from './common/modules';
import { chartTranslations } from './common/charts';
import { paginationTranslations } from './common/pagination';
import { logisticsTranslations } from './common/logistics';
import { forecastingTranslations } from './common/forecasting';
import { moduleDescriptionsTranslations } from './common/moduleDescriptions';
import { moduleStatsTranslations } from './common/moduleStats';

export const commonTranslations: CommonTranslations = {
  // UI translations
  ui: uiTranslations,
  
  // Chart translations
  chartTitles: chartTranslations.chartTitles,
  zones: chartTranslations.zones,
  
  // Pagination translations
  pagination: paginationTranslations,
  
  // Module translations
  modules: moduleTranslations,
  
  // Module descriptions and stats
  ...moduleDescriptionsTranslations,
  ...moduleStatsTranslations,
  
  // Include full sections as nested objects
  logistics: logisticsTranslations,
  inventory: inventoryTranslations,
  forecasting: forecastingTranslations
};
