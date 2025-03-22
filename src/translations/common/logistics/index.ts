
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
  },
  
  // Add filter-related translations
  filterByDate: generalLogisticsTranslations.filterByDate,
  advancedFilters: generalLogisticsTranslations.advancedFilters,
  searchPlaceholder: generalLogisticsTranslations.searchPlaceholder,
  filterByStatus: generalLogisticsTranslations.filterByStatus,
  allStatuses: generalLogisticsTranslations.allStatuses,
  filterByCarrier: generalLogisticsTranslations.filterByCarrier,
  allCarriers: generalLogisticsTranslations.allCarriers,
  clearFilters: generalLogisticsTranslations.clearFilters,
  resetFilters: generalLogisticsTranslations.resetFilters,
  applyFilters: generalLogisticsTranslations.applyFilters,
  carriers: generalLogisticsTranslations.carriers,
  
  // Map-related translations
  mapView: generalLogisticsTranslations.mapView,
  mapViewSettings: generalLogisticsTranslations.mapViewSettings,
  mapViewDescription: generalLogisticsTranslations.mapViewDescription,
  showRoutes: generalLogisticsTranslations.showRoutes,
  showHeatmap: generalLogisticsTranslations.showHeatmap,
  clusterMarkers: generalLogisticsTranslations.clusterMarkers,
  refreshData: generalLogisticsTranslations.refreshData,
  analyticsView: generalLogisticsTranslations.analyticsView,
  
  // Advanced filter translations
  priority: generalLogisticsTranslations.priority,
  selectPriority: generalLogisticsTranslations.selectPriority,
  allPriorities: generalLogisticsTranslations.allPriorities,
  highPriority: generalLogisticsTranslations.highPriority,
  mediumPriority: generalLogisticsTranslations.mediumPriority,
  lowPriority: generalLogisticsTranslations.lowPriority,
  
  region: generalLogisticsTranslations.region,
  selectRegion: generalLogisticsTranslations.selectRegion,
  allRegions: generalLogisticsTranslations.allRegions,
  regions: generalLogisticsTranslations.regions,
  
  shippingMethod: generalLogisticsTranslations.shippingMethod,
  selectShipping: generalLogisticsTranslations.selectShipping,
  allMethods: generalLogisticsTranslations.allMethods,
  express: generalLogisticsTranslations.express,
  standard: generalLogisticsTranslations.standard,
  economy: generalLogisticsTranslations.economy,
  sameDay: generalLogisticsTranslations.sameDay,
  
  deliveryTimeRange: generalLogisticsTranslations.deliveryTimeRange,
  day: generalLogisticsTranslations.day,
  days: generalLogisticsTranslations.days,
  costRange: generalLogisticsTranslations.costRange,
  
  international: generalLogisticsTranslations.international,
  customsClearance: generalLogisticsTranslations.customsClearance,
  specialHandling: generalLogisticsTranslations.specialHandling
};
