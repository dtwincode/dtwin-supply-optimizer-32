
import { MaturityCategory } from "../types/maturity";

export const calculateCategoryScore = (category: MaturityCategory) => {
  const totalLevels = category.subcategories.reduce((sum, sub) => sum + sub.level, 0);
  const maxPossibleScore = category.subcategories.length * 4;
  return (totalLevels / maxPossibleScore) * 100;
};

export const getRecommendations = (score: number, category: MaturityCategory, isArabic: boolean) => {
  if (category.name === "Demand Forecasting") {
    if (score < 25) {
      return isArabic 
        ? `تحتاج إلى تطوير عملية جمع البيانات الأساسية. المتطلبات: بيانات المبيعات التاريخية لمدة 12 شهراً على الأقل، تحليل الاتجاهات الموسمية، وتتبع تأثير العروض الترويجية`
        : `Need to develop basic data collection process. Requirements: Historical sales data for at least 12 months, seasonal trend analysis, and promotional impact tracking`;
    } else if (score < 50) {
      return isArabic
        ? `تحسين جودة البيانات وأتمتة التحليل. المتطلبات: نظام تنبؤ آلي، تكامل بيانات نقاط البيع، وتحليل متقدم للاتجاهات`
        : `Improve data quality and automate analysis. Requirements: Automated forecasting system, POS data integration, and advanced trend analysis`;
    } else if (score < 75) {
      return isArabic
        ? `تطبيق تقنيات متقدمة. المتطلبات: تحليلات البيانات الضخمة، التعلم الآلي للتنبؤ، وتكامل بيانات السوق الخارجية`
        : `Implement advanced techniques. Requirements: Big data analytics, ML forecasting, and external market data integration`;
    } else {
      return isArabic
        ? `الحفاظ على التميز وتحسين الدقة. المتطلبات: تحديث مستمر للنماذج، تحليل السيناريوهات، والتكامل مع سلسلة التوريد`
        : `Maintain excellence and improve accuracy. Requirements: Continuous model updates, scenario analysis, and supply chain integration`;
    }
  }
  
  return isArabic 
    ? `تطوير ${category.nameAr} من خلال تحسين العمليات وجمع البيانات المناسبة`
    : `Develop ${category.name} through process improvement and appropriate data collection`;
};

export const getDataRequirements = (score: number, isArabic: boolean) => {
  if (score < 25) {
    return {
      data: isArabic 
        ? ["بيانات المبيعات الأساسية", "معلومات المخزون الأساسية", "بيانات العملاء الأساسية"]
        : ["Basic sales data", "Basic inventory information", "Basic customer data"],
      tools: isArabic
        ? ["جداول Excel أساسية", "نظام نقاط البيع الأساسي"]
        : ["Basic Excel sheets", "Basic POS system"],
      collaboration: isArabic
        ? ["تنسيق أسبوعي بين الأقسام", "مشاركة التقارير الأساسية"]
        : ["Weekly department coordination", "Basic report sharing"]
    };
  } else if (score < 50) {
    return {
      data: isArabic
        ? ["بيانات مبيعات تفصيلية", "تتبع المخزون في الوقت الفعلي", "تحليل سلوك العملاء"]
        : ["Detailed sales data", "Real-time inventory tracking", "Customer behavior analysis"],
      tools: isArabic
        ? ["نظام تخطيط موارد المؤسسات", "أدوات التحليل المتقدمة", "لوحات المعلومات التفاعلية"]
        : ["ERP system", "Advanced analytics tools", "Interactive dashboards"],
      collaboration: isArabic
        ? ["اجتماعات يومية للفريق", "مشاركة التحليلات في الوقت الفعلي", "تكامل البيانات بين الإدارات"]
        : ["Daily team meetings", "Real-time analytics sharing", "Cross-department data integration"]
    };
  } else if (score < 75) {
    return {
      data: isArabic
        ? ["بيانات السوق الخارجية", "تحليلات التنبؤ المتقدمة", "بيانات سلسلة التوريد الكاملة"]
        : ["External market data", "Advanced forecasting analytics", "Complete supply chain data"],
      tools: isArabic
        ? ["منصة تحليلات متكاملة", "أدوات التعلم الآلي", "نظام تخطيط متقدم"]
        : ["Integrated analytics platform", "Machine learning tools", "Advanced planning system"],
      collaboration: isArabic
        ? ["تعاون في الوقت الفعلي", "مشاركة التنبؤات الآلية", "تكامل مع الموردين"]
        : ["Real-time collaboration", "Automated forecast sharing", "Supplier integration"]
    };
  } else {
    return {
      data: isArabic
        ? ["بيانات السوق الشاملة", "تحليلات متقدمة للعملاء", "بيانات سلسلة التوريد العالمية"]
        : ["Comprehensive market data", "Advanced customer analytics", "Global supply chain data"],
      tools: isArabic
        ? ["منصة ذكاء أعمال متكاملة", "أدوات تحليل متقدمة", "نظام تخطيط شامل"]
        : ["Integrated BI platform", "Advanced analytics suite", "Comprehensive planning system"],
      collaboration: isArabic
        ? ["تكامل شامل بين الأقسام", "تعاون مع الشركاء الخارجيين", "مشاركة البيانات في الوقت الفعلي"]
        : ["Full department integration", "External partner collaboration", "Real-time data sharing"]
    };
  }
};
