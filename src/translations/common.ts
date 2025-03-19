
import { CommonTranslations } from './types';
import { uiTranslations } from './common/ui';
import { inventoryTranslations } from './common/inventory';
import { moduleTranslations } from './common/modules';
import { chartTranslations } from './common/charts';
import { paginationTranslations } from './common/pagination';
import { logisticsTranslations } from './common/logistics';
import { forecastingTranslations } from './common/forecasting';

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
  
  // Include full sections as nested objects
  logistics: logisticsTranslations,
  inventory: inventoryTranslations,
  forecasting: forecastingTranslations
};
