
import { DashboardMetrics, ExecutiveSummary } from '../types';

export const dashboardTranslations: DashboardMetrics = {
  totalSKUs: {
    en: "Total SKUs",
    ar: "إجمالي وحدات التخزين"
  },
  bufferPenetration: {
    en: "Buffer Penetration",
    ar: "اختراق المخزون"
  },
  orderStatus: {
    en: "Order Status",
    ar: "حالة الطلب"
  },
  flowIndex: {
    en: "Flow Index",
    ar: "مؤشر التدفق"
  }
};

export const executiveSummaryTranslations: ExecutiveSummary = {
  title: {
    en: "Executive Summary",
    ar: "ملخص تنفيذي"
  },
  lastUpdated: {
    en: "Last updated",
    ar: "آخر تحديث"
  },
  kpis: {
    orderFulfillment: {
      en: "Order Fulfillment Rate",
      ar: "معدل إتمام الطلبات"
    },
    inventoryTurnover: {
      en: "Inventory Turnover",
      ar: "معدل دوران المخزون"
    },
    stockoutRate: {
      en: "Stockout Rate",
      ar: "معدل نفاد المخزون"
    },
    planningCycleTime: {
      en: "Planning Cycle Time",
      ar: "وقت دورة التخطيط"
    }
  },
  performanceTrend: {
    en: "Supply Chain Performance",
    ar: "أداء سلسلة التوريد"
  },
  performanceTrendDesc: {
    en: "Actual vs Target performance over time",
    ar: "الأداء الفعلي مقابل المستهدف على مدار الوقت"
  },
  bufferDistribution: {
    en: "Buffer Distribution",
    ar: "توزيع المخزون"
  },
  bufferDistributionDesc: {
    en: "Current buffer status across all SKUs",
    ar: "حالة المخزون الحالية عبر جميع وحدات SKU"
  },
  criticalAlerts: {
    en: "Critical Alerts",
    ar: "تنبيهات حرجة"
  },
  alerts: {
    lowBuffer: {
      en: "Critical Low Buffer Levels Detected",
      ar: "تم اكتشاف مستويات منخفضة حرجة للمخزون"
    },
    lowBufferDesc: {
      en: "12 SKUs have reached critical buffer levels and require immediate attention",
      ar: "وصلت 12 وحدة SKU إلى مستويات حرجة من المخزون وتتطلب اهتمامًا فوريًا"
    },
    demandSpike: {
      en: "Unexpected Demand Spike",
      ar: "ارتفاع غير متوقع في الطلب"
    },
    demandSpikeDesc: {
      en: "A 35% increase in demand has been detected for Product Category A in Region 3",
      ar: "تم اكتشاف زيادة بنسبة 35٪ في الطلب على فئة المنتج أ في المنطقة 3"
    }
  },
  impact: {
    high: {
      en: "High Impact",
      ar: "تأثير مرتفع"
    },
    medium: {
      en: "Medium Impact",
      ar: "تأثير متوسط"
    },
    low: {
      en: "Low Impact",
      ar: "تأثير منخفض"
    }
  },
  noAlerts: {
    en: "No critical alerts at this time",
    ar: "لا توجد تنبيهات حرجة في الوقت الحالي"
  },
  moduleHealth: {
    en: "Module Health",
    ar: "صحة الوحدات"
  },
  moduleHealthDesc: {
    en: "Current status of all system modules",
    ar: "الحالة الحالية لجميع وحدات النظام"
  },
  status: {
    healthy: {
      en: "Healthy",
      ar: "صحي"
    },
    warning: {
      en: "Warning",
      ar: "تحذير"
    },
    critical: {
      en: "Critical",
      ar: "حرج"
    }
  },
  charts: {
    actual: {
      en: "Actual",
      ar: "فعلي"
    },
    target: {
      en: "Target",
      ar: "مستهدف"
    }
  }
};
