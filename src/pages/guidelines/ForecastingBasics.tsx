
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const ForecastingBasics = () => {
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
          {language === 'ar' ? "أساسيات التنبؤ" : "Forecasting Basics"}
        </h1>
        
        <Separator className="my-6" />

        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>{language === 'ar' ? "فهم التنبؤ بالطلب" : "Understanding Demand Forecasting"}</h2>
            
            <h3>{language === 'ar' ? "نماذج التنبؤ" : "Forecasting Models"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "المتوسط المتحرك" : "Moving Average"}</strong>
                <p>{language === 'ar'
                  ? "نموذج بسيط يستخدم متوسط البيانات التاريخية"
                  : "Simple model using historical data averages"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "التنعيم الأسي" : "Exponential Smoothing"}</strong>
                <p>{language === 'ar'
                  ? "يعطي وزناً أكبر للبيانات الأحدث"
                  : "Gives more weight to recent data"}
                </p>
              </li>
              <li>
                <strong>SARIMA</strong>
                <p>{language === 'ar'
                  ? "نموذج متقدم يتعامل مع الموسمية والاتجاهات"
                  : "Advanced model handling seasonality and trends"}
                </p>
              </li>
              <li>
                <strong>Prophet</strong>
                <p>{language === 'ar'
                  ? "نموذج قوي يتعامل مع التغيرات الموسمية والعطلات"
                  : "Robust model handling seasonal changes and holidays"}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "تحليل البيانات" : "Data Analysis"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "التحليل الوصفي" : "Descriptive Analysis"}</strong>
                <p>{language === 'ar'
                  ? "فهم أنماط البيانات التاريخية"
                  : "Understanding historical data patterns"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "تحليل النمط" : "Pattern Analysis"}</strong>
                <p>{language === 'ar'
                  ? "تحديد الاتجاهات والموسمية"
                  : "Identifying trends and seasonality"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "التحقق من الصحة" : "Validation"}</strong>
                <p>{language === 'ar'
                  ? "اختبار دقة التنبؤات"
                  : "Testing forecast accuracy"}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "العوامل الخارجية" : "External Factors"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "الأحداث التسويقية" : "Marketing Events"}</strong>
                <p>{language === 'ar'
                  ? "تأثير الحملات والترويجات"
                  : "Impact of campaigns and promotions"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "الطقس" : "Weather"}</strong>
                <p>{language === 'ar'
                  ? "تأثير الظروف الجوية على الطلب"
                  : "Weather conditions affecting demand"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "العطلات" : "Holidays"}</strong>
                <p>{language === 'ar'
                  ? "تأثير العطلات والمواسم"
                  : "Impact of holidays and seasons"}
                </p>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ForecastingBasics;
