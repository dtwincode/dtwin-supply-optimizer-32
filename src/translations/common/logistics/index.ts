import { generalLogisticsTranslations } from "./general";
import { statusTranslations } from "./status";
import { notificationTranslations } from "./notifications";
import { metricsTranslations } from "./metrics";
import { mapTranslations } from "./map";
import { warehouseTranslations } from "./warehouses";
import { routeTranslations } from "./routes";
import { pipelineTranslations } from "./pipeline";
import { analyticsTranslations } from "./analytics";
import { sustainabilityTranslations } from "./sustainability";
import { ddomTranslations } from "./ddom";
import { filterTranslations } from "./filters";
import { regionTranslations } from "./regions";
import { carrierTranslations } from "./carriers";
import { timeTranslations } from "./time";

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
  status: statusTranslations.status, // Use the nested status object that matches the interface
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
  predictiveETA: { en: "Predictive ETA", ar: "الوقت المتوقع للوصول (تنبؤ)" },
  shipment: { en: "Shipment", ar: "الشحنة" },
  route: { en: "Route", ar: "المسار" },
  originalETA: { en: "Original ETA", ar: "الوقت الأصلي للوصول" },
  predictedETA: { en: "Predicted ETA", ar: "الوقت المتوقع للوصول" },
  confidence: { en: "Confidence", ar: "مستوى الثقة" },
  early: { en: "Early", ar: "مبكر" },
  onTime: { en: "On Time", ar: "في الوقت المحدد" },
  vsLastYear: { en: "vs Last Year", ar: "مقارنة بالعام الماضي" },
  trends: { en: "Trends", ar: "الاتجاهات" },
  breakdown: { en: "Breakdown", ar: "التفصيل" },
  efficiency: { en: "Efficiency", ar: "الكفاءة" },
  exportReport: { en: "Export Report", ar: "تصدير التقرير" },
  topReductions: { en: "Top Reductions", ar: "أهم التخفيضات" },

  switchToRail: { en: "Switch to Rail", ar: "التحول إلى السكك الحديدية" },
  optimizeRoutes: { en: "Optimize Routes", ar: "تحسين المسارات" },
  useEVs: { en: "Use EVs", ar: "استخدام المركبات الكهربائية" },
  yearTarget: { en: "Year Target", ar: "الهدف السنوي" },
  ofTarget: { en: "of Target", ar: "من الهدف" },
  yearGoalProgress: { en: "Year Goal Progress", ar: "تقدم الهدف السنوي" },
  transportTypes: { en: "Transport Types", ar: "أنواع النقل" },
  co2PerShipment: { en: "CO₂ per Shipment", ar: "انبعاثات CO₂ لكل شحنة" },
  co2PerKm: { en: "CO₂ per km", ar: "انبعاثات CO₂ لكل كيلومتر" },
  carbonOffset: { en: "Carbon Offset", ar: "تعويض الكربون" },
  ofTotal: { en: "of Total", ar: "من الإجمالي" },
  yoy: { en: "Year-over-Year (YoY)", ar: "سنة على سنة" },
  ddsopCompliance: {
    en: "DDS&OP Compliant",
    ar: "متوافق مع DDS&OP",
  },
};
