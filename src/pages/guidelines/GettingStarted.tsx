
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const GettingStarted = () => {
  const { language, isRTL } = useLanguage();

  return (
    <DashboardLayout>
      <div className="flex flex-col p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-2 mb-4">
          <Link 
            to="/guidelines"
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            {language === 'ar' ? "العودة إلى الدليل" : "Back to Guidelines"}
          </Link>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          {language === 'ar' ? "البدء والإعداد" : "Getting Started"}
        </h1>
        
        <Separator className="my-6" />

        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>{language === 'ar' ? "مرحباً بك في منصة التنبؤ بالطلب" : "Welcome to the Demand Forecasting Platform"}</h2>
            
            <h3>{language === 'ar' ? "المتطلبات الأساسية" : "Prerequisites"}</h3>
            <ul>
              <li>{language === 'ar' ? "حساب مستخدم صالح" : "Valid user account"}</li>
              <li>{language === 'ar' ? "بيانات المبيعات التاريخية" : "Historical sales data"}</li>
              <li>{language === 'ar' ? "معلومات المنتج الأساسية" : "Basic product information"}</li>
              <li>{language === 'ar' ? "معلومات المخزون" : "Inventory information"}</li>
              <li>{language === 'ar' ? "بيانات سلسلة التوريد" : "Supply chain data"}</li>
            </ul>

            <h3>{language === 'ar' ? "إعداد النظام" : "System Setup"}</h3>
            <ol>
              <li>
                <strong>{language === 'ar' ? "تكوين SQL" : "SQL Configuration"}</strong>
                <p>{language === 'ar' 
                  ? "قم بإعداد اتصال SQL لتخزين واسترجاع البيانات الخاصة بك"
                  : "Set up your SQL connection for storing and retrieving data"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "تحميل البيانات" : "Data Upload"}</strong>
                <p>{language === 'ar'
                  ? "استخدم أداة تحميل البيانات لاستيراد بياناتك التاريخية"
                  : "Use the data upload tool to import your historical data"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "التسلسل الهرمي للمنتجات" : "Product Hierarchy"}</strong>
                <p>{language === 'ar'
                  ? "قم بإعداد التسلسل الهرمي للمنتجات لتنظيم منتجاتك"
                  : "Set up product hierarchy to organize your products"}
                </p>
              </li>
            </ol>

            <h3>{language === 'ar' ? "الوحدات الأساسية" : "Core Modules"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "التنبؤ" : "Forecasting"}</strong>
                <p>{language === 'ar'
                  ? "توقع الطلب المستقبلي باستخدام نماذج متقدمة"
                  : "Predict future demand using advanced models"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "المخزون" : "Inventory"}</strong>
                <p>{language === 'ar'
                  ? "إدارة المخزون وتحسين مستويات المخزون"
                  : "Manage inventory and optimize stock levels"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "التسويق" : "Marketing"}</strong>
                <p>{language === 'ar'
                  ? "تخطيط وتتبع الحملات التسويقية"
                  : "Plan and track marketing campaigns"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "التقارير" : "Reports"}</strong>
                <p>{language === 'ar'
                  ? "إنشاء تقارير تفصيلية وتحليلات"
                  : "Generate detailed reports and analytics"}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "الخطوات التالية" : "Next Steps"}</h3>
            <p>{language === 'ar'
              ? "بعد إكمال الإعداد الأساسي، استكشف أساسيات التنبؤ للبدء في إنشاء توقعات دقيقة."
              : "After completing the basic setup, explore the Forecasting Basics to start creating accurate predictions."}
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GettingStarted;
