
import { MaturityCategory } from "../types/maturity";

export const calculateCategoryScore = (category: MaturityCategory) => {
  const totalLevels = category.subcategories.reduce((sum, sub) => sum + sub.level, 0);
  const maxPossibleScore = category.subcategories.length * 4;
  return (totalLevels / maxPossibleScore) * 100;
};

export const getLevelColor = (level: number): string => {
  switch (level) {
    case 0:
      return "bg-gray-300";
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-blue-500";
    case 4:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};

export const getLevelName = (level: number, isArabic: boolean): string => {
  switch (level) {
    case 0:
      return isArabic ? "غير موجود" : "Non-existent";
    case 1:
      return isArabic ? "أساسي" : "Basic";
    case 2:
      return isArabic ? "متطور" : "Developing";
    case 3:
      return isArabic ? "متقدم" : "Advanced";
    case 4:
      return isArabic ? "متميز" : "Excellence";
    default:
      return isArabic ? "غير معروف" : "Unknown";
  }
};

export const getRecommendations = (score: number, category: MaturityCategory, isArabic: boolean) => {
  // Demand Driven Planning recommendations (DDMRP)
  if (category.name === "Demand Forecasting") {
    if (score < 25) {
      return isArabic 
        ? `تطوير أساسيات DDMRP. المتطلبات: تحديد نقاط الفصل الاستراتيجية، تأسيس مستويات المخزون المؤقت، تطوير نظام إشارات الطلب`
        : `Develop DDMRP fundamentals. Requirements: Strategic decoupling point identification, buffer level establishment, demand signaling system`;
    } else if (score < 50) {
      return isArabic
        ? `تحسين تطبيق DDMRP. المتطلبات: تحسين معادلات المخزون المؤقت، أتمتة إشارات الطلب، تكامل بيانات السوق`
        : `Enhance DDMRP implementation. Requirements: Buffer equation optimization, demand signal automation, market data integration`;
    } else if (score < 75) {
      return isArabic
        ? `تطبيق DDMRP متقدم. المتطلبات: تعديل ديناميكي للمخزون المؤقت، تحليل تأثير السوق، التخطيط التعاوني`
        : `Advanced DDMRP implementation. Requirements: Dynamic buffer adjustments, market impact analysis, collaborative planning`;
    } else {
      return isArabic
        ? `تميز في DDMRP. المتطلبات: تكامل سلسلة التوريد بالكامل، تحسين مستمر للنماذج، تخطيط السيناريوهات`
        : `DDMRP excellence. Requirements: Full supply chain integration, continuous model optimization, scenario planning`;
    }
  }
  
  // Inventory Management recommendations (Based on SCOR model)
  if (category.name === "Inventory Management") {
    if (score < 25) {
      return isArabic
        ? `تطوير إدارة المخزون الأساسية. المتطلبات: تحديد مواقع التخزين الاستراتيجية، تصنيف ABC للمخزون، تطبيق نظام إدارة المخزون الاحتياطي`
        : `Develop basic inventory management. Requirements: Strategic storage locations, ABC inventory classification, safety stock management system`;
    } else if (score < 50) {
      return isArabic
        ? `تحسين إدارة المخزون. المتطلبات: تطبيق نظام الباركود، التتبع في الوقت الفعلي، تحليل معدل الدوران والتكلفة`
        : `Improve inventory management. Requirements: Barcode implementation, real-time tracking, turnover and cost analysis`;
    } else if (score < 75) {
      return isArabic
        ? `إدارة مخزون متقدمة. المتطلبات: نظام RFID، تحليلات تنبؤية، إدارة سلسلة التبريد، تحسين المخزون متعدد المستويات`
        : `Advanced inventory management. Requirements: RFID system, predictive analytics, cold chain management, multi-echelon optimization`;
    } else {
      return isArabic
        ? `تميز في إدارة المخزون. المتطلبات: أتمتة المستودعات، تحليلات متقدمة، تكامل الموردين، تحسين الشبكة اللوجستية`
        : `Inventory management excellence. Requirements: Warehouse automation, advanced analytics, supplier integration, network optimization`;
    }
  }

  // Logistics Capabilities recommendations (Based on Gartner's model)
  if (category.name === "Logistics Capabilities") {
    if (score < 25) {
      return isArabic
        ? `تطوير القدرات اللوجستية الأساسية. المتطلبات: تخطيط المسارات الأساسي، تتبع الشحنات، إدارة الأسطول، تحليل التكاليف`
        : `Develop basic logistics capabilities. Requirements: Basic route planning, shipment tracking, fleet management, cost analysis`;
    } else if (score < 50) {
      return isArabic
        ? `تحسين القدرات اللوجستية. المتطلبات: تتبع GPS متقدم، تخطيط المسارات الديناميكي، تحليل أداء التسليم، إدارة الجودة`
        : `Enhance logistics capabilities. Requirements: Advanced GPS tracking, dynamic route planning, delivery performance analysis, quality management`;
    } else if (score < 75) {
      return isArabic
        ? `قدرات لوجستية متقدمة. المتطلبات: تحسين المسارات في الوقت الفعلي، تكامل العملاء، تحليل التكلفة المتقدم، إدارة المخاطر`
        : `Advanced logistics capabilities. Requirements: Real-time route optimization, customer integration, advanced cost analytics, risk management`;
    } else {
      return isArabic
        ? `تميز في القدرات اللوجستية. المتطلبات: أتمتة العمليات الكاملة، تكامل سلسلة التوريد، التحليلات التنبؤية، الاستدامة`
        : `Logistics capabilities excellence. Requirements: Full operations automation, supply chain integration, predictive analytics, sustainability`;
    }
  }

  // Supply Chain Visibility (Based on Gartner's Digital Supply Chain Framework)
  if (category.name === "Supply Chain Visibility") {
    if (score < 25) {
      return isArabic
        ? `تطوير الرؤية الأساسية. المتطلبات: تتبع المخزون الأساسي، تحديث حالة الطلبات يدويًا، تقارير أساسية`
        : `Develop basic visibility. Requirements: Basic inventory tracking, manual order status updates, basic reporting`;
    } else if (score < 50) {
      return isArabic
        ? `تحسين الرؤية. المتطلبات: تتبع في الوقت الفعلي، لوحات معلومات تفاعلية، تنبيهات آلية`
        : `Enhance visibility. Requirements: Real-time tracking, interactive dashboards, automated alerts`;
    } else if (score < 75) {
      return isArabic
        ? `رؤية متقدمة. المتطلبات: تكامل البيانات من طرف لطرف، تحليلات تنبؤية، رؤية متعددة المستويات`
        : `Advanced visibility. Requirements: End-to-end data integration, predictive analytics, multi-tier visibility`;
    } else {
      return isArabic
        ? `تميز في الرؤية. المتطلبات: رؤية شاملة للشبكة، تحليلات ذكية، التعاون في الوقت الفعلي`
        : `Visibility excellence. Requirements: Network-wide visibility, intelligent analytics, real-time collaboration`;
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
        ? ["بيانات المخزون الأساسية", "بيانات الطلب التاريخية", "بيانات التكلفة الأساسية", "معلومات الموردين الأساسية"]
        : ["Basic inventory data", "Historical demand data", "Basic cost data", "Basic supplier information"],
      tools: isArabic
        ? ["نظام ERP أساسي", "أدوات تخطيط أساسية", "نظام تتبع المخزون"]
        : ["Basic ERP system", "Basic planning tools", "Inventory tracking system"],
      collaboration: isArabic
        ? ["اجتماعات أسبوعية للتخطيط", "تنسيق داخلي أساسي", "تواصل مع الموردين الرئيسيين"]
        : ["Weekly planning meetings", "Basic internal coordination", "Key supplier communication"]
    };
  } else if (score < 50) {
    return {
      data: isArabic
        ? ["بيانات المخزون في الوقت الفعلي", "تحليل الطلب المتقدم", "تحليل التكلفة التفصيلي", "معلومات سلسلة التوريد"]
        : ["Real-time inventory data", "Advanced demand analysis", "Detailed cost analysis", "Supply chain information"],
      tools: isArabic
        ? ["نظام DDMRP", "أدوات التخطيط المتقدمة", "نظام إدارة المستودعات", "نظام تتبع متقدم"]
        : ["DDMRP system", "Advanced planning tools", "WMS system", "Advanced tracking system"],
      collaboration: isArabic
        ? ["تخطيط يومي", "تنسيق متعدد الأقسام", "تكامل مع الموردين الرئيسيين"]
        : ["Daily planning", "Cross-department coordination", "Key supplier integration"]
    };
  } else if (score < 75) {
    return {
      data: isArabic
        ? ["تحليلات متقدمة للطلب", "بيانات السوق في الوقت الفعلي", "تحليلات التكلفة المتقدمة", "بيانات سلسلة التوريد الكاملة"]
        : ["Advanced demand analytics", "Real-time market data", "Advanced cost analytics", "Complete supply chain data"],
      tools: isArabic
        ? ["منصة DDMRP متكاملة", "نظام تخطيط متقدم", "أدوات التحليلات التنبؤية", "نظام إدارة النقل"]
        : ["Integrated DDMRP platform", "Advanced planning system", "Predictive analytics tools", "TMS system"],
      collaboration: isArabic
        ? ["تخطيط متكامل", "تعاون في الوقت الفعلي", "تكامل كامل مع الموردين"]
        : ["Integrated planning", "Real-time collaboration", "Full supplier integration"]
    };
  } else {
    return {
      data: isArabic
        ? ["تحليلات الطلب في الوقت الفعلي", "تحليلات السوق الشاملة", "تحليلات سلسلة التوريد المتقدمة", "بيانات التكلفة الشاملة"]
        : ["Real-time demand analytics", "Comprehensive market analytics", "Advanced supply chain analytics", "Complete cost data"],
      tools: isArabic
        ? ["منصة DDMRP متقدمة", "نظام تخطيط ذكي", "منصة تحليلات متكاملة", "نظام إدارة سلسلة التوريد الشامل"]
        : ["Advanced DDMRP platform", "Intelligent planning system", "Integrated analytics platform", "Complete SCM system"],
      collaboration: isArabic
        ? ["تخطيط متكامل وذكي", "تعاون شامل في الوقت الفعلي", "تكامل كامل مع شبكة التوريد"]
        : ["Intelligent integrated planning", "Comprehensive real-time collaboration", "Full supply network integration"]
    };
  }
};
