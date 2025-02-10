
import { CommonTranslations } from './types';
import { uiTranslations } from './common/ui';
import { inventoryTranslations } from './common/inventory';
import { moduleTranslations } from './common/modules';
import { chartTranslations } from './common/charts';
import { paginationTranslations } from './common/pagination';

export const commonTranslations: CommonTranslations = {
  ...uiTranslations,
  ...inventoryTranslations,
  ...moduleTranslations,
  ...chartTranslations,
  ...paginationTranslations
};
