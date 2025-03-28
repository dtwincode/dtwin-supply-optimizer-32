
import { Translations } from './types';
import { commonTranslations } from './common';
import { navigationTranslations } from './navigation';
import { dashboardTranslations } from './dashboard';
import { inventoryTranslations } from './inventory';
import { marketingTranslations } from './marketing';
import { salesTranslations } from './sales';
import { dashboardMetricsTranslations } from './dashboard';

export const translations: Translations = {
  en: {
    common: {
      loading: "Loading...",
      noData: "No data available",
      error: "Error",
      success: "Success",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      submit: "Submit",
      skus: "SKUs",
      create: "Create"
    },
    sales: {
      title: "Sales",
      salesPlanning: "Sales Planning",
      returnsManagement: "Returns Management",
      newSalesPlan: "New Sales Plan",
      viewReturns: "View Returns"
    },
    navigation: {
      dashboard: "Dashboard",
      forecasting: "Forecasting",
      inventory: "Inventory",
      marketing: "Marketing",
      sales: "Sales",
      logistics: "Logistics",
      reports: "Reports",
      tickets: "Tickets",
      settings: "Settings"
    },
    dashboard: dashboardTranslations,
    inventory: inventoryTranslations,
    marketing: marketingTranslations
  },
  ar: {
    common: {
      loading: "جاري التحميل...",
      noData: "لا توجد بيانات",
      error: "خطأ",
      success: "نجاح",
      confirm: "تأكيد",
      back: "رجوع",
      next: "التالي",
      submit: "إرسال",
      skus: "الوحدات",
      create: "إنشاء"
    },
    sales: {
      title: "المبيعات",
      salesPlanning: "تخطيط المبيعات",
      returnsManagement: "إدارة المرتجعات",
      newSalesPlan: "خطة مبيعات جديدة",
      viewReturns: "عرض المرتجعات"
    },
    navigation: {
      dashboard: "لوحة القيادة",
      forecasting: "التنبؤ",
      inventory: "المخزون",
      marketing: "التسويق",
      sales: "المبيعات",
      logistics: "الخدمات اللوجستية",
      reports: "التقارير",
      tickets: "التذاكر",
      settings: "الإعدادات"
    },
    dashboard: {
      title: "لوحة القيادة",
      overview: "نظرة عامة",
      recentActivity: "النشاط الأخير",
      metrics: "المقاييس الرئيسية",
      performance: "الأداء",
      trends: "الاتجاهات",
      alerts: "التنبيهات",
      notifications: "الإشعارات"
    },
    inventory: {
      title: "المخزون",
      overview: "نظرة عامة",
      decoupling: "نقاط الفصل",
      classification: "تصنيف الوحدات",
      bufferManagement: "إدارة المخزون المؤقت",
      netFlow: "وضع التدفق الصافي",
      adu: "متوسط الاستخدام اليومي",
      aiInsights: "رؤى الذكاء الاصطناعي",
      itemCount: "عدد العناصر",
      filterItems: "تصفية العناصر",
      searchItems: "بحث العناصر",
      addDecouplingPoint: "إضافة نقطة فصل",
      configureBuffer: "تكوين ملف المخزون المؤقت",
      manageClassification: "إدارة التصنيفات",
      viewInsights: "عرض الرؤى",
      reconfigureNetwork: "إعادة تكوين الشبكة",
      optimizeBuffers: "تحسين المخزون المؤقت",
      zoneStatus: "حالة المنطقة"
    },
    marketing: {
      title: "التسويق",
      overview: "نظرة عامة",
      campaigns: "الحملات",
      analytics: "التحليلات",
      forecastImpact: "تأثير التنبؤ",
      integration: "التكامل",
      createCampaign: "إنشاء حملة",
      viewAnalytics: "عرض التحليلات",
      optimizeCampaign: "تحسين الحملة",
      reviewPerformance: "مراجعة الأداء",
      campaignPlanner: "مخطط الحملة",
      marketingCalendar: "تقويم التسويق"
    }
  }
};

// Re-export translations for more direct access
export { 
  commonTranslations,
  navigationTranslations,
  dashboardTranslations,
  inventoryTranslations,
  marketingTranslations,
  salesTranslations,
  dashboardMetricsTranslations
};
