
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
  ...notificationTranslations,
  ...metricsTranslations,
  ...mapTranslations,
  ...warehouseTranslations,
  ...routeTranslations,
  ...pipelineTranslations,
  ...analyticsTranslations,
  ...sustainabilityTranslations,
  ...ddomTranslations,
  
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
  
  // Ensure we have all the properties required by LogisticsTranslations interface
  purchaseOrderPipeline: {
    en: "Purchase Order Pipeline",
    ar: "خط أنابيب أوامر الشراء"
  },
  monitorAndTrack: {
    en: "Monitor and Track",
    ar: "مراقبة وتتبع"
  },
  routeOptimizationDesc: {
    en: "Optimize delivery routes for efficiency",
    ar: "تحسين مسارات التسليم للكفاءة"
  },
  transportModesDesc: {
    en: "Manage different transport modes",
    ar: "إدارة وسائل النقل المختلفة"
  },
  documentManagement: {
    en: "Document Management",
    ar: "إدارة المستندات"
  },
  uploadAndManage: {
    en: "Upload and Manage",
    ar: "تحميل وإدارة"
  },
  uploadedDocuments: {
    en: "Uploaded Documents",
    ar: "المستندات المحملة"
  },
  optimizeSupplyChain: {
    en: "Optimize Supply Chain",
    ar: "تحسين سلسلة التوريد"
  },
  logisticsTrackingMap: {
    en: "Logistics Tracking Map",
    ar: "خريطة تتبع الخدمات اللوجستية"
  },
  mapUnavailable: {
    en: "Map Unavailable",
    ar: "الخريطة غير متوفرة"
  },
  mapError: {
    en: "Error Loading Map",
    ar: "خطأ في تحميل الخريطة"
  }
};
