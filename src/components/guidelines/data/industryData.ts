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
            name: "Seasonal Trends",
            nameAr: "الاتجاهات الموسمية",
            level: 0,
            description: "Analysis of seasonal shopping patterns",
            descriptionAr: "تحليل أنماط التسوق الموسمية"
          },
          {
            name: "Promotion Impact",
            nameAr: "تأثير العروض",
            level: 0,
            description: "Measuring promotional campaign effectiveness",
            descriptionAr: "قياس فعالية الحملات الترويجية"
          },
          {
            name: "Store Traffic",
            nameAr: "حركة المتجر",
            level: 0,
            description: "Foot traffic analysis and prediction",
            descriptionAr: "تحليل وتوقع حركة المرور في المتجر"
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
