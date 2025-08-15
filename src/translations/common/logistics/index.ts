
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
import { filterTranslations } from './filters';
import { regionTranslations } from './regions';
import { carrierTranslations } from './carriers';
import { timeTranslations } from './time';

// Combine all logistics translations
export const logisticsTranslations = {
  ...generalLogisticsTranslations,
  ...notificationTranslations,
  ...metricsTranslations,
  ...mapTranslations,
  ...warehouseTranslations,
  ...routeTranslations,
  ...pipelineTranslations,
  ...analyticsTranslations,
  ...sustainabilityTranslations,
  ...filterTranslations,
  ...regionTranslations,
  ...carrierTranslations,
  ...timeTranslations,
  
  // Import status translations properly - ensuring the nested structures are preserved
  status: statusTranslations.status,  // Use the nested status object that matches the interface
  statusLabel: statusTranslations.statusLabel,
  inTransit: statusTranslations.inTransit,
  delivered: statusTranslations.delivered,
  processing: statusTranslations.processing,
  outForDelivery: statusTranslations.outForDelivery,
  exception: statusTranslations.exception,
  delayedEta: statusTranslations.delayedEta,
  pending: statusTranslations.pending,
  
  // Making sure essential translations are available for the top-level
  dashboard: generalLogisticsTranslations.dashboard,
  tracking: generalLogisticsTranslations.tracking,
  analytics: generalLogisticsTranslations.analytics,
  sustainability: generalLogisticsTranslations.sustainability,
  
  // Add DDOM translations
  ddom: ddomTranslations,
  
  ddsopCompliance: {
    en: "DDS&OP Compliant",
    ar: "متوافق مع DDS&OP"
  }
};
