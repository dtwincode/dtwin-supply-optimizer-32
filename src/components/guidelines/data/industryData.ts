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
  },
  {
    id: "groceries",
    name: "Groceries",
    nameAr: "البقالة",
    maturityData: [
      {
        name: "Inventory Management",
        nameAr: "إدارة المخزون",
        score: 0,
        subcategories: [
          {
            name: "Perishable Tracking",
            nameAr: "تتبع المواد القابلة للتلف",
            level: 0,
            description: "Freshness and expiration date monitoring",
            descriptionAr: "مراقبة الطزاجة وتاريخ انتهاء الصلاحية"
          },
          {
            name: "Cold Chain Management",
            nameAr: "إدارة سلسلة التبريد",
            level: 0,
            description: "Temperature-controlled inventory tracking",
            descriptionAr: "تتبع المخزون المتحكم في درجة حرارته"
          },
          {
            name: "Waste Management",
            nameAr: "إدارة النفايات",
            level: 0,
            description: "Systems to minimize product waste",
            descriptionAr: "أنظمة لتقليل هدر المنتجات"
          },
          {
            name: "Freshness Indicators",
            nameAr: "مؤشرات الطزاجة",
            level: 0,
            description: "Visual indicators for product freshness",
            descriptionAr: "مؤشرات مرئية لطزاجة المنتج"
          }
        ]
      },
      {
        name: "Demand Forecasting",
        nameAr: "التنبؤ بالطلب",
        score: 0,
        subcategories: [
          {
            name: "Seasonal Patterns",
            nameAr: "الأنماط الموسمية",
            level: 0,
            description: "Seasonal demand pattern recognition",
            descriptionAr: "التعرف على نمط الطلب الموسمي"
          },
          {
            name: "Promotion Impact",
            nameAr: "تأثير العروض",
            level: 0,
            description: "Measuring promotional activities impact",
            descriptionAr: "قياس تأثير الأنشطة الترويجية"
          },
          {
            name: "Weather Sensitivity",
            nameAr: "الحساسية للطقس",
            level: 0,
            description: "Weather impact on demand patterns",
            descriptionAr: "تأثير الطقس على أنماط الطلب"
          },
          {
            name: "Short-cycle Forecasting",
            nameAr: "التنبؤ قصير الدورة",
            level: 0,
            description: "Daily and weekly demand forecasting",
            descriptionAr: "التنبؤ بالطلب اليومي والأسبوعي"
          }
        ]
      },
      {
        name: "Buffer Management",
        nameAr: "إدارة المخزون المؤقت",
        score: 0,
        subcategories: [
          {
            name: "Shelf-life Based Buffers",
            nameAr: "المخزونات المؤقتة حسب مدة الصلاحية",
            level: 0,
            description: "Buffer adjustments based on shelf life",
            descriptionAr: "تعديلات المخزونات المؤقتة بناءً على مدة الصلاحية"
          },
          {
            name: "Dynamic Buffer Levels",
            nameAr: "مستويات المخزون المؤقت الديناميكية",
            level: 0,
            description: "Adjusting buffers based on sales velocity",
            descriptionAr: "تعديل المخزونات المؤقتة بناءً على سرعة المبيعات"
          },
          {
            name: "Category-specific Buffers",
            nameAr: "المخزونات المؤقتة الخاصة بالفئة",
            level: 0,
            description: "Different buffer strategies by category",
            descriptionAr: "استراتيجيات مخزون مؤقت مختلفة حسب الفئة"
          },
          {
            name: "Waste Reduction Buffers",
            nameAr: "مخزونات مؤقتة لتقليل الهدر",
            level: 0,
            description: "Buffer strategies to minimize waste",
            descriptionAr: "استراتيجيات المخزون المؤقت لتقليل الهدر"
          }
        ]
      },
      {
        name: "Supplier Collaboration",
        nameAr: "التعاون مع الموردين",
        score: 0,
        subcategories: [
          {
            name: "Vendor-Managed Inventory",
            nameAr: "المخزون المدار من قبل البائع",
            level: 0,
            description: "VMI implementation with suppliers",
            descriptionAr: "تنفيذ نظام المخزون المدار من قبل البائع مع الموردين"
          },
          {
            name: "Local Sourcing",
            nameAr: "التوريد المحلي",
            level: 0,
            description: "Local producer collaboration for fresh items",
            descriptionAr: "التعاون مع المنتجين المحليين للعناصر الطازجة"
          },
          {
            name: "Quality Standards",
            nameAr: "معايير الجودة",
            level: 0,
            description: "Supplier quality assurance process",
            descriptionAr: "عملية ضمان جودة المورد"
          },
          {
            name: "Delivery Schedule",
            nameAr: "جدول التسليم",
            level: 0,
            description: "Optimized delivery scheduling for freshness",
            descriptionAr: "جدولة التسليم المحسنة للطزاجة"
          }
        ]
      },
      {
        name: "Logistics Management",
        nameAr: "إدارة الخدمات اللوجستية",
        score: 0,
        subcategories: [
          {
            name: "Temperature Control",
            nameAr: "التحكم في درجة الحرارة",
            level: 0,
            description: "Temperature-controlled transportation",
            descriptionAr: "النقل المتحكم في درجة الحرارة"
          },
          {
            name: "Last Mile Delivery",
            nameAr: "توصيل الميل الأخير",
            level: 0,
            description: "Fresh product home delivery capabilities",
            descriptionAr: "قدرات توصيل المنتجات الطازجة للمنازل"
          },
          {
            name: "Cross-docking",
            nameAr: "التفريغ المتقاطع",
            level: 0,
            description: "Cross-docking for perishable items",
            descriptionAr: "التفريغ المتقاطع للمواد القابلة للتلف"
          },
          {
            name: "Route Optimization",
            nameAr: "تحسين المسار",
            level: 0,
            description: "Delivery route optimization for freshness",
            descriptionAr: "تحسين مسار التسليم للطزاجة"
          }
        ]
      }
    ]
  },
  {
    id: "electronics",
    name: "Electronics Sales",
    nameAr: "مبيعات الإلكترونيات",
    maturityData: [
      {
        name: "Product Lifecycle Management",
        nameAr: "إدارة دورة حياة المنتج",
        score: 0,
        subcategories: [
          {
            name: "Lifecycle Tracking",
            nameAr: "تتبع دورة الحياة",
            level: 0,
            description: "Product lifecycle stage monitoring",
            descriptionAr: "مراقبة مرحلة دورة حياة المنتج"
          },
          {
            name: "Obsolescence Management",
            nameAr: "إدارة التقادم",
            level: 0,
            description: "Strategies for end-of-life products",
            descriptionAr: "استراتيجيات للمنتجات في نهاية عمرها"
          },
          {
            name: "Version Control",
            nameAr: "التحكم في الإصدار",
            level: 0,
            description: "Product version and model tracking",
            descriptionAr: "تتبع إصدار المنتج والطراز"
          },
          {
            name: "Technology Roadmap",
            nameAr: "خارطة طريق التكنولوجيا",
            level: 0,
            description: "Future technology planning integration",
            descriptionAr: "تكامل تخطيط التكنولوجيا المستقبلية"
          }
        ]
      },
      {
        name: "Demand Driven Planning",
        nameAr: "التخطيط المدفوع بالطلب",
        score: 0,
        subcategories: [
          {
            name: "Strategic Decoupling Points",
            nameAr: "نقاط الفصل الاستراتيجية",
            level: 0,
            description: "High-value component buffer positioning",
            descriptionAr: "تحديد مواقع المخزون المؤقت للمكونات عالية القيمة"
          },
          {
            name: "Launch Planning",
            nameAr: "تخطيط الإطلاق",
            level: 0,
            description: "New product launch buffer strategy",
            descriptionAr: "استراتيجية المخزون المؤقت لإطلاق منتج جديد"
          },
          {
            name: "Variability Management",
            nameAr: "إدارة التغير",
            level: 0,
            description: "Managing promotional demand spikes",
            descriptionAr: "إدارة ارتفاعات الطلب الترويجية"
          },
          {
            name: "Price Erosion Adjustment",
            nameAr: "تعديل تآكل السعر",
            level: 0,
            description: "Buffer adjustments for price changes",
            descriptionAr: "تعديلات المخزون المؤقت لتغيرات الأسعار"
          }
        ]
      },
      {
        name: "Inventory Optimization",
        nameAr: "تحسين المخزون",
        score: 0,
        subcategories: [
          {
            name: "Value-based Management",
            nameAr: "الإدارة القائمة على القيمة",
            level: 0,
            description: "High-value inventory protection strategies",
            descriptionAr: "استراتيجيات حماية المخزون عالي القيمة"
          },
          {
            name: "Display Stock Optimization",
            nameAr: "تحسين مخزون العرض",
            level: 0,
            description: "Optimized floor and display stock levels",
            descriptionAr: "مستويات محسنة لمخزون الأرضية والعرض"
          },
          {
            name: "Component Commonality",
            nameAr: "شيوع المكونات",
            level: 0,
            description: "Common component inventory strategy",
            descriptionAr: "استراتيجية مخزون المكونات المشتركة"
          },
          {
            name: "Serial Number Tracking",
            nameAr: "تتبع الرقم التسلسلي",
            level: 0,
            description: "Individual unit tracking capabilities",
            descriptionAr: "قدرات تتبع الوحدة الفردية"
          }
        ]
      },
      {
        name: "Supply Chain Analytics",
        nameAr: "تحليلات سلسلة التوريد",
        score: 0,
        subcategories: [
          {
            name: "Market Intelligence",
            nameAr: "استخبارات السوق",
            level: 0,
            description: "Component market trend monitoring",
            descriptionAr: "مراقبة اتجاهات سوق المكونات"
          },
          {
            name: "Substitution Analysis",
            nameAr: "تحليل الاستبدال",
            level: 0,
            description: "Product substitution pattern tracking",
            descriptionAr: "تتبع نمط استبدال المنتج"
          },
          {
            name: "Competitor Monitoring",
            nameAr: "مراقبة المنافسين",
            level: 0,
            description: "Competitor stock and price tracking",
            descriptionAr: "تتبع مخزون وأسعار المنافسين"
          },
          {
            name: "Performance Indicators",
            nameAr: "مؤشرات الأداء",
            level: 0,
            description: "Electronics-specific KPI monitoring",
            descriptionAr: "مراقبة مؤشرات الأداء الخاصة بالإلكترونيات"
          }
        ]
      },
      {
        name: "Warranty & Returns",
        nameAr: "الضمان والمرتجعات",
        score: 0,
        subcategories: [
          {
            name: "Return Rate Analysis",
            nameAr: "تحليل معدل المرتجعات",
            level: 0,
            description: "Product return pattern analysis",
            descriptionAr: "تحليل نمط إرجاع المنتج"
          },
          {
            name: "Warranty Planning",
            nameAr: "تخطيط الضمان",
            level: 0,
            description: "Service parts inventory management",
            descriptionAr: "إدارة مخزون قطع الغيار"
          },
          {
            name: "RMA Process",
            nameAr: "عملية ترخيص إرجا�� المواد",
            level: 0,
            description: "Return merchandise authorization efficiency",
            descriptionAr: "كفاءة ترخيص إرجاع البضائع"
          },
          {
            name: "Refurbishment Program",
            nameAr: "برنامج التجديد",
            level: 0,
            description: "Returned product refurbishment process",
            descriptionAr: "عملية تجديد المنتج المرتجع"
          }
        ]
      }
    ]
  }
];
