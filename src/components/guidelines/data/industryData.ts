import { Industry } from "../types/maturity";

export const industries: Industry[] = [
  {
    id: "retail",
    name: "Retail",
    nameAr: "تجارة التجزئة",
    maturityData: [
      {
        name: "Demand Forecasting",
        nameAr: "التنبؤ بالطلب",
        score: 0,
        subcategories: [
          {
            name: "Statistical Forecasting",
            nameAr: "التنبؤ الإحصائي",
            level: 0,
            description: "Use of statistical methods for demand prediction",
            descriptionAr: "استخدام الأساليب الإحصائية للتنبؤ بالطلب"
          },
          {
            name: "Promotional Impact Analysis",
            nameAr: "تحليل تأثير العروض",
            level: 0,
            description: "Analysis of promotional campaigns on demand",
            descriptionAr: "تحليل تأثير الحملات الترويجية على الطلب"
          },
          {
            name: "Market Intelligence Integration",
            nameAr: "تكامل معلومات السوق",
            level: 0,
            description: "Integration of market data and trends",
            descriptionAr: "دمج بيانات واتجاهات السوق"
          },
          {
            name: "Machine Learning Models",
            nameAr: "نماذج التعلم الآلي",
            level: 0,
            description: "Advanced ML-based forecasting models",
            descriptionAr: "نماذج التنبؤ المتقدمة القائمة على التعلم الآلي"
          }
        ]
      },
      {
        name: "Inventory Management",
        nameAr: "إدارة المخزون",
        score: 0,
        subcategories: [
          {
            name: "Stock Level Optimization",
            nameAr: "تحسين مستويات المخزون",
            level: 0,
            description: "Optimal inventory level management",
            descriptionAr: "إدارة المستوى الأمثل للمخزون"
          },
          {
            name: "Buffer Management",
            nameAr: "إدارة المخزون الاحتياطي",
            level: 0,
            description: "Strategic buffer positioning and sizing",
            descriptionAr: "تحديد وتحجيم المخزون الاحتياطي الاستراتيجي"
          },
          {
            name: "Warehouse Management",
            nameAr: "إدارة المستودعات",
            level: 0,
            description: "Warehouse operations and optimization",
            descriptionAr: "عمليات وتحسين المستودعات"
          },
          {
            name: "Multi-Echelon Optimization",
            nameAr: "تحسين متعدد المستويات",
            level: 0,
            description: "Network-wide inventory optimization",
            descriptionAr: "تحسين المخزون على مستوى الشبكة"
          }
        ]
      },
      {
        name: "Supply Chain Planning",
        nameAr: "تخطيط سلسلة التوريد",
        score: 0,
        subcategories: [
          {
            name: "Sales & Operations Planning",
            nameAr: "تخطيط المبيعات والعمليات",
            level: 0,
            description: "Integrated business planning process",
            descriptionAr: "عملية تخطيط الأعمال المتكاملة"
          },
          {
            name: "Network Design",
            nameAr: "تصميم الشبكة",
            level: 0,
            description: "Supply chain network optimization",
            descriptionAr: "تحسين شبكة سلسلة التوريد"
          },
          {
            name: "Supplier Collaboration",
            nameAr: "التعاون مع الموردين",
            level: 0,
            description: "Strategic supplier relationship management",
            descriptionAr: "إدارة العلاقات الاستراتيجية مع الموردين"
          },
          {
            name: "Risk Management",
            nameAr: "إدارة المخاطر",
            level: 0,
            description: "Supply chain risk assessment and mitigation",
            descriptionAr: "تقييم وتخفيف مخاطر سلسلة التوريد"
          }
        ]
      },
      {
        name: "Logistics Capabilities",
        nameAr: "القدرات اللوجستية",
        score: 0,
        subcategories: [
          {
            name: "Transportation Management",
            nameAr: "إدارة النقل",
            level: 0,
            description: "Fleet and route optimization",
            descriptionAr: "تحسين الأسطول والمسارات"
          },
          {
            name: "Last Mile Delivery",
            nameAr: "التوصيل للميل الأخير",
            level: 0,
            description: "Final delivery optimization",
            descriptionAr: "تحسين التوصيل النهائي"
          },
          {
            name: "Reverse Logistics",
            nameAr: "الخدمات اللوجستية العكسية",
            level: 0,
            description: "Returns and recycling management",
            descriptionAr: "إدارة المرتجعات وإعادة التدوير"
          },
          {
            name: "Cross-Docking",
            nameAr: "التحميل المتقاطع",
            level: 0,
            description: "Efficient cross-docking operations",
            descriptionAr: "عمليات التحميل المتقاطع الفعالة"
          }
        ]
      },
      {
        name: "Digital Transformation",
        nameAr: "التحول الرقمي",
        score: 0,
        subcategories: [
          {
            name: "Process Automation",
            nameAr: "أتمتة العمليات",
            level: 0,
            description: "Automated workflow implementation",
            descriptionAr: "تنفيذ سير العمل الآلي"
          },
          {
            name: "Data Analytics",
            nameAr: "تحليل البيانات",
            level: 0,
            description: "Advanced analytics capabilities",
            descriptionAr: "قدرات التحليلات المتقدمة"
          },
          {
            name: "IoT Integration",
            nameAr: "تكامل إنترنت الأشياء",
            level: 0,
            description: "Smart device network implementation",
            descriptionAr: "تنفيذ شبكة الأجهزة الذكية"
          },
          {
            name: "Blockchain Integration",
            nameAr: "تكامل البلوكتشين",
            level: 0,
            description: "Blockchain technology adoption",
            descriptionAr: "تبني تقنية البلوكتشين"
          }
        ]
      },
      {
        name: "Sustainability",
        nameAr: "الاستدامة",
        score: 0,
        subcategories: [
          {
            name: "Carbon Footprint",
            nameAr: "البصمة الكربونية",
            level: 0,
            description: "Emissions tracking and reduction",
            descriptionAr: "تتبع وتخفيض الانبعاثات"
          },
          {
            name: "Waste Management",
            nameAr: "إدارة النفايات",
            level: 0,
            description: "Waste reduction and recycling",
            descriptionAr: "تقليل النفايات وإعادة التدوير"
          },
          {
            name: "Green Transportation",
            nameAr: "النقل الأخضر",
            level: 0,
            description: "Sustainable transportation methods",
            descriptionAr: "طرق النقل المستدامة"
          },
          {
            name: "Circular Economy",
            nameAr: "الاقتصاد الدائري",
            level: 0,
            description: "Circular economy practices",
            descriptionAr: "ممارسات الاقتصاد الدائري"
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
