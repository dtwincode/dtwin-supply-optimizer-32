import { Industry } from "../types/maturity";

export const industries: Industry[] = [
  {
    id: "retail",
    name: "Retail",
    nameAr: "تجارة التجزئة",
    maturityData: [
      {
        name: "Demand Driven Planning",
        nameAr: "التخطيط المدفوع بالطلب",
        score: 0,
        subcategories: [
          {
            name: "Strategic Decoupling Points",
            nameAr: "نقاط الفصل الاستراتيجية",
            level: 0,
            description: "Strategic placement of inventory positions",
            descriptionAr: "التحديد الاستراتيجي لمواقع المخزون"
          },
          {
            name: "Buffer Profiles",
            nameAr: "ملفات المخزون المؤقت",
            level: 0,
            description: "Buffer profile configuration and management",
            descriptionAr: "تكوين وإدارة ملفات المخزون المؤقت"
          },
          {
            name: "Dynamic Adjustments",
            nameAr: "التعديلات الديناميكية",
            level: 0,
            description: "Buffer level dynamic adjustment capability",
            descriptionAr: "قدرة التعديل الديناميكي لمستويات المخزون"
          },
          {
            name: "Demand Signals",
            nameAr: "إشارات الطلب",
            level: 0,
            description: "Real-time demand signal processing",
            descriptionAr: "معالجة إشارات الطلب في الوقت الفعلي"
          }
        ]
      },
      {
        name: "Buffer Management",
        nameAr: "إدارة المخزون المؤقت",
        score: 0,
        subcategories: [
          {
            name: "Zone Calculation",
            nameAr: "حساب النطاقات",
            level: 0,
            description: "Red, yellow, and green zone calculations",
            descriptionAr: "حسابات النطاقات الحمراء والصفراء والخضراء"
          },
          {
            name: "Buffer Monitoring",
            nameAr: "مراقبة المخزون المؤقت",
            level: 0,
            description: "Real-time buffer status monitoring",
            descriptionAr: "مراقبة حالة المخزون المؤقت في الوقت الفعلي"
          },
          {
            name: "Adjustment Factors",
            nameAr: "عوامل التعديل",
            level: 0,
            description: "Lead time and variability factor management",
            descriptionAr: "إدارة وقت التوريد وعوامل التغير"
          },
          {
            name: "Buffer Alerts",
            nameAr: "تنبيهات المخزون",
            level: 0,
            description: "Automated buffer penetration alerts",
            descriptionAr: "تنبيهات آلية لاختراق المخزون"
          }
        ]
      },
      {
        name: "Operational Visibility",
        nameAr: "الرؤية التشغيلية",
        score: 0,
        subcategories: [
          {
            name: "Stock Status",
            nameAr: "حالة المخزون",
            level: 0,
            description: "Real-time inventory position visibility",
            descriptionAr: "رؤية موقع المخزون في الوقت الفعلي"
          },
          {
            name: "Order Status",
            nameAr: "حالة الطلبات",
            level: 0,
            description: "Purchase order tracking and monitoring",
            descriptionAr: "تتبع ومراقبة أوامر الشراء"
          },
          {
            name: "Performance Metrics",
            nameAr: "مقاييس الأداء",
            level: 0,
            description: "Key DDMRP performance indicators",
            descriptionAr: "مؤشرات الأداء الرئيسية للنظام"
          },
          {
            name: "Analytics Dashboard",
            nameAr: "لوحة التحليلات",
            level: 0,
            description: "Integrated analytics and reporting",
            descriptionAr: "التحليلات والتقارير المتكاملة"
          }
        ]
      },
      {
        name: "Demand Driven Execution",
        nameAr: "التنفيذ المدفوع بالطلب",
        score: 0,
        subcategories: [
          {
            name: "Supply Order Generation",
            nameAr: "توليد أوامر التوريد",
            level: 0,
            description: "Automated supply order recommendations",
            descriptionAr: "توصيات آلية لأوامر التوريد"
          },
          {
            name: "Priority Management",
            nameAr: "إدارة الأولويات",
            level: 0,
            description: "Buffer-based execution priorities",
            descriptionAr: "أولويات التنفيذ على أساس المخزون المؤقت"
          },
          {
            name: "Lead Time Management",
            nameAr: "إدارة وقت التوريد",
            level: 0,
            description: "Decoupled and buffer lead times",
            descriptionAr: "أوقات التوريد المفصولة والمؤقتة"
          },
          {
            name: "Exception Management",
            nameAr: "إدارة الاستثناءات",
            level: 0,
            description: "Alert and exception handling",
            descriptionAr: "معالجة التنبيهات والاستثناءات"
          }
        ]
      },
      {
        name: "Planning Parameters",
        nameAr: "معايير التخطيط",
        score: 0,
        subcategories: [
          {
            name: "ADU Calculation",
            nameAr: "حساب الاستخدام اليومي",
            level: 0,
            description: "Average daily usage calculation methods",
            descriptionAr: "طرق حساب متوسط الاستخدام اليومي"
          },
          {
            name: "Buffer Profiles",
            nameAr: "ملفات المخزون",
            level: 0,
            description: "Buffer profile configuration",
            descriptionAr: "تكوين ملفات المخزون"
          },
          {
            name: "Decoupling Configuration",
            nameAr: "تكوين نقاط الفصل",
            level: 0,
            description: "Decoupling point setup and management",
            descriptionAr: "إعداد وإدارة نقاط الفصل"
          },
          {
            name: "Parameter Maintenance",
            nameAr: "صيانة المعايير",
            level: 0,
            description: "Regular parameter review and updates",
            descriptionAr: "مراجعة وتحديث المعايير بانتظام"
          }
        ]
      },
      {
        name: "Analytics & Reporting",
        nameAr: "التحليلات والتقارير",
        score: 0,
        subcategories: [
          {
            name: "Buffer Performance",
            nameAr: "أداء المخزون المؤقت",
            level: 0,
            description: "Buffer penetration and status analytics",
            descriptionAr: "تحليلات اختراق وحالة المخزون المؤقت"
          },
          {
            name: "Execution Metrics",
            nameAr: "مقاييس التنفيذ",
            level: 0,
            description: "Order generation and execution tracking",
            descriptionAr: "تتبع توليد وتنفيذ الأوامر"
          },
          {
            name: "Financial Impact",
            nameAr: "الأثر المالي",
            level: 0,
            description: "Investment and service level analysis",
            descriptionAr: "تحليل الاستثمار ومستوى الخدمة"
          },
          {
            name: "Performance Reporting",
            nameAr: "تقارير الأداء",
            level: 0,
            description: "KPI dashboards and reporting",
            descriptionAr: "لوحات المؤشرات وإعداد التقارير"
          }
        ]
      }
    ]
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    nameAr: "صيدلية",
    maturityData: [
      {
        name: "Inventory Management",
        nameAr: "إدارة المخزون",
        score: 0,
        subcategories: [
          {
            name: "Expiry Tracking",
            nameAr: "تتبع انتهاء الصلاحية",
            level: 0,
            description: "Medication expiry date monitoring",
            descriptionAr: "مراقبة تواريخ انتهاء صلاحية الأدوية"
          },
          {
            name: "Cold Chain",
            nameAr: "سلسلة التبريد",
            level: 0,
            description: "Temperature-sensitive product management",
            descriptionAr: "إدارة المنتجات الحساسة للحرارة"
          },
          {
            name: "Prescription Trends",
            nameAr: "اتجاهات الوصفات الطبية",
            level: 0,
            description: "Prescription pattern analysis",
            descriptionAr: "تحليل نمط الوصفات الطبية"
          }
        ]
      },
      {
        name: "Demand Forecasting",
        nameAr: "التنبؤ بالطلب",
        score: 0,
        subcategories: [
          {
            name: "Data Collection",
            nameAr: "جمع البيانات",
            level: 0,
            description: "How frequently you collect sales data",
            descriptionAr: "مدى تكرار جمع بيانات المبيعات"
          },
          {
            name: "Historical Data",
            nameAr: "البيانات التاريخية",
            level: 0,
            description: "Available historical data coverage",
            descriptionAr: "تغطية البيانات التاريخية المتاحة"
          },
          {
            name: "Seasonality",
            nameAr: "الموسمية",
            level: 0,
            description: "Seasonal pattern tracking capability",
            descriptionAr: "قدرة تتبع النمط الموسمي"
          }
        ]
      },
      {
        name: "Logistics Capabilities",
        nameAr: "قدرات الخدمات اللوجستية",
        score: 0,
        subcategories: [
          {
            name: "Route Optimization",
            nameAr: "تحسين المسار",
            level: 0,
            description: "Delivery route planning approach",
            descriptionAr: "نهج تخطيط مسار التسليم"
          },
          {
            name: "Shipment Tracking",
            nameAr: "تتبع الشحنات",
            level: 0,
            description: "Shipment tracking capabilities",
            descriptionAr: "قدرات تتبع الشحنات"
          },
          {
            name: "Performance Monitoring",
            nameAr: "مراقبة الأداء",
            level: 0,
            description: "Delivery performance measurement",
            descriptionAr: "قياس أداء التسليم"
          }
        ]
      },
      {
        name: "Sales & Marketing",
        nameAr: "المبيعات والتسويق",
        score: 0,
        subcategories: [
          {
            name: "Promotion Impact",
            nameAr: "تأثير الترويج",
            level: 0,
            description: "Promotional impact measurement",
            descriptionAr: "قياس تأثير الترويج"
          },
          {
            name: "Market Events",
            nameAr: "أحداث السوق",
            level: 0,
            description: "Market event tracking system",
            descriptionAr: "نظام تتبع أحداث السوق"
          },
          {
            name: "Channel Performance",
            nameAr: "أداء القنوات",
            level: 0,
            description: "Channel performance monitoring",
            descriptionAr: "مراقبة أداء القنوات"
          }
        ]
      }
    ]
  },
  {
    id: "fmcg",
    name: "FMCG",
    nameAr: "السلع الاستهلاكية",
    maturityData: [
      {
        name: "Supply Chain",
        nameAr: "سلسلة التوريد",
        score: 0,
        subcategories: [
          {
            name: "Raw Material Planning",
            nameAr: "تخطيط المواد الخام",
            level: 0,
            description: "Raw material requirement forecasting",
            descriptionAr: "التنبؤ باحتياجات المواد الخام"
          },
          {
            name: "Production Scheduling",
            nameAr: "جدولة الإنتاج",
            level: 0,
            description: "Production line optimization",
            descriptionAr: "تحسين خط الإنتاج"
          },
          {
            name: "Distribution Network",
            nameAr: "شبكة التوزيع",
            level: 0,
            description: "Distribution channel management",
            descriptionAr: "إدارة قنوات التوزيع"
          }
        ]
      },
      {
        name: "Demand Forecasting",
        nameAr: "التنبؤ بالطلب",
        score: 0,
        subcategories: [
          {
            name: "Data Collection",
            nameAr: "جمع البيانات",
            level: 0,
            description: "How frequently you collect sales data",
            descriptionAr: "مدى تكرار جمع بيانات المبيعات"
          },
          {
            name: "Historical Data",
            nameAr: "البيانات التاريخية",
            level: 0,
            description: "Available historical data coverage",
            descriptionAr: "تغطية البيانات التاريخية المتاحة"
          },
          {
            name: "Seasonality",
            nameAr: "الموسمية",
            level: 0,
            description: "Seasonal pattern tracking capability",
            descriptionAr: "قدرة تتبع النمط الموسمي"
          }
        ]
      },
      {
        name: "Inventory Management",
        nameAr: "إدارة المخزون",
        score: 0,
        subcategories: [
          {
            name: "Stock Monitoring",
            nameAr: "مراقبة المخزون",
            level: 0,
            description: "Inventory level monitoring approach",
            descriptionAr: "نهج مراقبة مستوى المخزون"
          },
          {
            name: "Buffer Management",
            nameAr: "إدارة المخزون الاحتياطي",
            level: 0,
            description: "Safety stock management method",
            descriptionAr: "طريقة إدارة المخزون الاحتياطي"
          },
          {
            name: "Lead Time Tracking",
            nameAr: "تتبع وقت التوريد",
            level: 0,
            description: "Supplier lead time tracking system",
            descriptionAr: "نظام تتبع وقت التوريد"
          }
        ]
      },
      {
        name: "Logistics Capabilities",
        nameAr: "قدرات الخدمات اللوجستية",
        score: 0,
        subcategories: [
          {
            name: "Route Optimization",
            nameAr: "تحسين المسار",
            level: 0,
            description: "Delivery route planning approach",
            descriptionAr: "نهج تخطيط مسار التسليم"
          },
          {
            name: "Shipment Tracking",
            nameAr: "تتبع الشحنات",
            level: 0,
            description: "Shipment tracking capabilities",
            descriptionAr: "قدرات تتبع الشحنات"
          },
          {
            name: "Performance Monitoring",
            nameAr: "مراقبة الأداء",
            level: 0,
            description: "Delivery performance measurement",
            descriptionAr: "قياس أداء التسليم"
          }
        ]
      },
      {
        name: "Sales & Marketing",
        nameAr: "المبيعات والتسويق",
        score: 0,
        subcategories: [
          {
            name: "Promotion Impact",
            nameAr: "تأثير الترويج",
            level: 0,
            description: "Promotional impact measurement",
            descriptionAr: "قياس تأثير الترويج"
          },
          {
            name: "Market Events",
            nameAr: "أحداث السوق",
            level: 0,
            description: "Market event tracking system",
            descriptionAr: "نظام تتبع أحداث السوق"
          },
          {
            name: "Channel Performance",
            nameAr: "أداء القنوات",
            level: 0,
            description: "Channel performance monitoring",
            descriptionAr: "مراقبة أداء القنوات"
          }
        ]
      }
    ]
  }
];
