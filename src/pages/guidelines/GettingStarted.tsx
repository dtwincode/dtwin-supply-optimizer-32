
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
            </ul>

            <h3>{language === 'ar' ? "الخطوات الأولى" : "First Steps"}</h3>
            <ol>
              <li>
                <strong>{language === 'ar' ? "تسجيل الدخول" : "Login"}</strong>
                <p>{language === 'ar' 
                  ? "استخدم بيانات اعتماد حسابك للوصول إلى لوحة التحكم"
                  : "Use your account credentials to access the dashboard"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "إعداد البيانات" : "Data Setup"}</strong>
                <p>{language === 'ar'
                  ? "قم بتحميل بيانات المبيعات التاريخية الخاصة بك في قسم الإعدادات"
                  : "Upload your historical sales data in the Settings section"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "تكوين المنتجات" : "Product Configuration"}</strong>
                <p>{language === 'ar'
                  ? "قم بإعداد التسلسل الهرمي للمنتجات وتحديد المعلمات الأساسية"
                  : "Set up product hierarchy and define key parameters"}
                </p>
              </li>
            </ol>

            <h3>{language === 'ar' ? "الخطوة التالية" : "Next Steps"}</h3>
            <p>{language === 'ar'
              ? "بمجرد اكتمال الإعداد الأساسي، يمكنك البدء في استكشاف ميزات التنبؤ الأساسية."
              : "Once the basic setup is complete, you can start exploring the core forecasting features."}
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GettingStarted;
