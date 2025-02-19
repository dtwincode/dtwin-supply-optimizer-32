import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { HelpCircle, Info, BookOpen, BarChart2 } from "lucide-react";

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
      <Card className="p-6 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              {isArabic ? "كيفية استخدام تقييم النضج" : "How to Use the Maturity Assessment"}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                {isArabic 
                  ? "١. راجع كل فئة ومؤشراتها الفرعية لفهم مستوى نضجك الحالي"
                  : "1. Review each category and its subcategories to understand your current maturity level"}
              </p>
              <p>
                {isArabic
                  ? "٢. قيّم مستواك الحالي باستخدام المقياس من ٠ إلى ٤"
                  : "2. Assess your current level using the 0-4 scale"}
              </p>
              <p>
                {isArabic
                  ? "٣. استخدم دليل المستويات في الأسفل لفهم كل مستوى"
                  : "3. Use the level guide at the bottom to understand each level"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {maturityData.map((category, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">
                {isArabic ? category.nameAr : category.name}
              </h3>
              <div className="ml-auto">
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </div>
            </div>
            <div className="space-y-6">
              {category.subcategories.map((subcat, subIdx) => (
                <div key={subIdx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{isArabic ? subcat.nameAr : subcat.name}</span>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </div>
                    <span className="text-muted-foreground font-medium">
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
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">
            {isArabic ? "دليل مستويات النضج" : "Maturity Level Guide"}
          </h3>
        </div>
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
