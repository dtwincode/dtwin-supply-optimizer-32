
import { TranslationValue } from '../types';

export type InventoryTranslations = {
  inventory: TranslationValue;
  bufferZones: TranslationValue;
  netFlowPosition: TranslationValue;
  unitsLabel: TranslationValue;
  createPO: TranslationValue;
  decouplingPoint: TranslationValue;
  netFlow: TranslationValue;
  buffers: TranslationValue;
  adu: TranslationValue;
  alerts: TranslationValue;
  // Table Headers
  sku: TranslationValue;
  name: TranslationValue;
  currentStock: TranslationValue;
  bufferZone: TranslationValue;
  location: TranslationValue;
  productFamily: TranslationValue;
  actions: TranslationValue;
  // Additional translations
  inventorymanagement: TranslationValue;
  skuCount: TranslationValue;
  purchaseOrderCreated: TranslationValue;
};

export const inventoryTranslations: InventoryTranslations = {
  inventory: {
    en: "Inventory",
    ar: "المخزون"
  },
  bufferZones: {
    en: "Buffer Zones",
    ar: "مناطق المخزون"
  },
  netFlowPosition: {
    en: "Net Flow Position",
    ar: "صافي التدفق"
  },
  unitsLabel: {
    en: "units",
    ar: "وحدات"
  },
  createPO: {
    en: "Create PO",
    ar: "إنشاء أمر شراء"
  },
  decouplingPoint: {
    en: "Decoupling Point",
    ar: "نقطة الفصل"
  },
  netFlow: {
    en: "Net Flow Analysis",
    ar: "تحليل التدفق الصافي"
  },
  buffers: {
    en: "Buffer Management",
    ar: "إدارة المخزون الاحتياطي"
  },
  adu: {
    en: "ADU & Spikes",
    ar: "معدل الاستخدام اليومي والقفزات"
  },
  alerts: {
    en: "Supply Alerts",
    ar: "تنبيهات التوريد"
  },
  inventorymanagement: {
    en: "Inventory Management",
    ar: "إدارة المخزون"
  },
  skuCount: {
    en: "SKUs",
    ar: "وحدات تخزين"
  },
  purchaseOrderCreated: {
    en: "Purchase order created!",
    ar: "تم إنشاء أمر الشراء!"
  },
  sku: {
    en: "SKU",
    ar: "رمز المنتج"
  },
  name: {
    en: "Name",
    ar: "الاسم"
  },
  currentStock: {
    en: "Current Stock",
    ar: "المخزون الحالي"
  },
  bufferZone: {
    en: "Buffer Zone",
    ar: "منطقة المخزون"
  },
  location: {
    en: "Location",
    ar: "الموقع"
  },
  productFamily: {
    en: "Product Family",
    ar: "عائلة المنتج"
  },
  actions: {
    en: "Actions",
    ar: "الإجراءات"
  }
};
