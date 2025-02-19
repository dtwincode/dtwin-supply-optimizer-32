
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

interface MaturityCategory {
  name: string;
  nameAr: string;
  score: number;
  subcategories: {
    name: string;
    nameAr: string;
    level: number;
    description: string;
    descriptionAr: string;
  }[];
}

const maturityData: MaturityCategory[] = [
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
];

const getLevelColor = (level: number) => {
  switch (level) {
    case 0: return 'bg-[#ea384c]'; // Red - Initial
    case 1: return 'bg-[#f59e0b]'; // Orange - Developing
    case 2: return 'bg-[#3b82f6]'; // Blue - Established
    case 3: return 'bg-[#22c55e]'; // Green - Advanced
    case 4: return 'bg-[#9b87f5]'; // Purple - Optimized
    default: return 'bg-gray-200';
  }
};

const getLevelName = (level: number, isArabic: boolean) => {
  switch (level) {
    case 0: return isArabic ? "أولي" : "Initial";
    case 1: return isArabic ? "نامي" : "Developing";
    case 2: return isArabic ? "مؤسس" : "Established";
    case 3: return isArabic ? "متقدم" : "Advanced";
    case 4: return isArabic ? "محسّن" : "Optimized";
    default: return isArabic ? "غير محدد" : "Undefined";
  }
};

export const MaturityAssessmentMap = () => {
  const { language, isRTL } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="p-6 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {isArabic ? "خريطة تقييم النضج" : "Maturity Assessment Map"}
        </h2>
        <p className="text-muted-foreground">
          {isArabic 
            ? "تقييم شامل لجاهزية المؤسسة عبر المجالات الرئيسية"
            : "Comprehensive assessment of organizational readiness across key domains"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {maturityData.map((category, idx) => (
          <Card key={idx} className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {isArabic ? category.nameAr : category.name}
            </h3>
            <div className="space-y-6">
              {category.subcategories.map((subcat, subIdx) => (
                <div key={subIdx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{isArabic ? subcat.nameAr : subcat.name}</span>
                    <span className="text-muted-foreground">
                      {getLevelName(subcat.level, isArabic)}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getLevelColor(subcat.level)} transition-all`}
                      style={{ width: `${(subcat.level / 4) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? subcat.descriptionAr : subcat.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {isArabic ? "دليل مستويات النضج" : "Maturity Level Guide"}
        </h3>
        <div className="grid gap-4 md:grid-cols-5">
          {[0, 1, 2, 3, 4].map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${getLevelColor(level)}`} />
              <span className="text-sm">
                {getLevelName(level, isArabic)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
