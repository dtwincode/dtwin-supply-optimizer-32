
import { CommonTranslations } from './types';
import { uiTranslations } from './common/ui';
import { inventoryTranslations } from './common/inventory';
import { moduleTranslations } from './common/modules';
import { chartTranslations } from './common/charts';
import { paginationTranslations } from './common/pagination';
import { logisticsTranslations } from './common/logistics';

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
  
  // Add missing chart translations for replenishment and netFlow
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
  ...moduleTranslations,
  
  // Include full sections as nested objects
  logistics: logisticsTranslations,
  inventory: inventoryTranslations,
  
  // Add other required common translations
  settings: { en: "Settings", ar: "الإعدادات" },
  logout: { en: "Logout", ar: "تسجيل الخروج" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  save: { en: "Save", ar: "حفظ" },
  delete: { en: "Delete", ar: "حذف" },
  edit: { en: "Edit", ar: "تعديل" },
  create: { en: "Create", ar: "إنشاء" },
  search: { en: "Search", ar: "بحث" },
  filter: { en: "Filter", ar: "تصفية" },
  apply: { en: "Apply", ar: "تطبيق" },
  reset: { en: "Reset", ar: "إعادة ضبط" },
  loading: { en: "Loading...", ar: "جار التحميل..." },
  noData: { en: "No data available", ar: "لا توجد بيانات" },
  error: { en: "Error", ar: "خطأ" },
  success: { en: "Success", ar: "نجاح" },
  confirm: { en: "Confirm", ar: "تأكيد" },
  back: { en: "Back", ar: "رجوع" },
  next: { en: "Next", ar: "التالي" },
  submit: { en: "Submit", ar: "إرسال" },
  skus: { en: "SKUs", ar: "وحدات التخزين" },
  modules: { en: "Modules", ar: "الوحدات" },
  skuCount: { en: "SKU Count", ar: "عدد وحدات التخزين" },
  accuracyLabel: { en: "Accuracy", ar: "الدقة" },
  pipelineValue: { en: "Pipeline Value", ar: "قيمة خط الأنابيب" },
  activeCampaigns: { en: "Active Campaigns", ar: "الحملات النشطة" },
  onTimeDelivery: { en: "On-Time Delivery", ar: "التسليم في الوقت المحدد" },
  reportCount: { en: "Available Reports", ar: "التقارير المتاحة" },
  thisQuarter: { en: "this quarter", ar: "هذا الربع" },
  fromLastMonth: { en: "from last month", ar: "من الشهر الماضي" },
  fromLastWeek: { en: "from last week", ar: "من الأسبوع الماضي" },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل" }
};
