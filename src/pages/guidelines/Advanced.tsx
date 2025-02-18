import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const Advanced = () => {
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
          {language === 'ar' ? "الميزات المتقدمة" : "Advanced Features"}
        </h1>
        
        <Separator className="my-6" />

        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>{language === 'ar' ? "استكشاف الميزات المتقدمة" : "Exploring Advanced Features"}</h2>
            
            <h3>{language === 'ar' ? "ضبط النموذج" : "Model Tuning"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "تحسين المعلمات" : "Parameter Optimization"}</strong>
                <p>{language === 'ar'
                  ? "تحسين دقة التنبؤ عن طريق ضبط المعلمات"
                  : "Improve forecast accuracy by tuning parameters"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "التحقق من الصحة" : "Validation Techniques"}</strong>
                <p>{language === 'ar'
                  ? "استخدام تقنيات التحقق من الصحة لضمان الدقة"
                  : "Using validation techniques to ensure accuracy"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "التحليل بأثر رجعي" : "Backtesting"}</strong>
                <p>{language === 'ar'
                  ? "تقييم أداء النموذج باستخدام البيانات التاريخية"
                  : "Evaluate model performance using historical data"}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "تحليل السيناريو" : "Scenario Analysis"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "تخطيط ماذا لو" : "What-If Planning"}</strong>
                <p>{language === 'ar'
                  ? "تقييم تأثير السيناريوهات المختلفة على التنبؤات"
                  : "Evaluate the impact of different scenarios on forecasts"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "تخطيط الطوارئ" : "Contingency Planning"}</strong>
                <p>{language === 'ar'
                  ? "الاستعداد للأحداث غير المتوقعة"
                  : "Preparing for unexpected events"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "تحليل الحساسية" : "Sensitivity Analysis"}</strong>
                <p>{language === 'ar'
                  ? "تحديد العوامل الأكثر تأثيراً على التنبؤات"
                  : "Identifying the most influential factors on forecasts"}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "المعلمات المخصصة" : "Custom Parameters"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "إضافة عوامل خارجية" : "Adding External Factors"}</strong>
                <p>{language === 'ar'
                  ? "دمج العوامل الخارجية في نماذج التنبؤ"
                  : "Incorporating external factors into forecasting models"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "تكوين النماذج" : "Model Configuration"}</strong>
                <p>{language === 'ar'
                  ? "تكوين النماذج لتلبية الاحتياجات المحددة"
                  : "Configuring models to meet specific needs"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "البرمجة النصية المخصصة" : "Custom Scripting"}</strong>
                <p>{language === 'ar'
                  ? "استخدام البرمجة النصية المخصصة لتوسيع وظائف التنبؤ"
                  : "Using custom scripting to extend forecasting functionality"}
                </p>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Advanced;
