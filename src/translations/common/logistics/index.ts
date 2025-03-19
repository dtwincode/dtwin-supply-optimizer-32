
import { generalLogisticsTranslations } from './general';
import { statusTranslations } from './status';
import { notificationTranslations } from './notifications';
import { metricsTranslations } from './metrics';
import { mapTranslations } from './map';
import { warehouseTranslations } from './warehouses';
import { routeTranslations } from './routes';
import { pipelineTranslations } from './pipeline';
import { analyticsTranslations } from './analytics';
import { sustainabilityTranslations } from './sustainability';
import { ddomTranslations } from './ddom';

// Combine all logistics translations
export const logisticsTranslations = {
  ...generalLogisticsTranslations,
  ...statusTranslations,
  ...notificationTranslations,
  ...metricsTranslations,
  ...mapTranslations,
  ...warehouseTranslations,
  ...routeTranslations,
  ...pipelineTranslations,
  ...analyticsTranslations,
  ...sustainabilityTranslations,
  ...ddomTranslations
};
