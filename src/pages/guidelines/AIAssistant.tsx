
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const AIAssistant = () => {
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
          {language === 'ar' ? "مساعد الذكاء الاصطناعي" : "AI Assistant"}
        </h1>
        
        <Separator className="my-6" />

        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>{language === 'ar' ? "استخدام مساعد الذكاء الاصطناعي" : "Using the AI Assistant"}</h2>
            
            <h3>{language === 'ar' ? "نظرة عامة" : "Overview"}</h3>
            <p>{language === 'ar'
              ? "تعرف على كيفية استخدام مساعد الذكاء الاصطناعي للحصول على رؤى فورية وتحسين سير عملك."
              : "Learn how to use the AI Assistant to get instant insights and improve your workflow."}
            </p>

            <h3>{language === 'ar' ? "أنواع الاستعلامات" : "Query Types"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "تحليل البيانات" : "Data Analysis"}</strong>
                <p>{language === 'ar'
                  ? "اطلب من الذكاء الاصطناعي تحليل البيانات وتقديم رؤى."
                  : "Ask the AI to analyze data and provide insights."}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "تفسير النموذج" : "Model Interpretation"}</strong>
                <p>{language === 'ar'
                  ? "فهم كيفية عمل نماذج التنبؤ."
                  : "Understand how forecasting models work."}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "اقتراحات التحسين" : "Improvement Suggestions"}</strong>
                <p>{language === 'ar'
                  ? "احصل على اقتراحات لتحسين دقة التنبؤ."
                  : "Get suggestions to improve forecasting accuracy."}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "التكامل مع سير العمل" : "Integration with Workflow"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "التنبؤ" : "Forecasting"}</strong>
                <p>{language === 'ar'
                  ? "استخدم الذكاء الاصطناعي لتحسين التنبؤات."
                  : "Use AI to enhance forecasts."}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "إدارة المخزون" : "Inventory Management"}</strong>
                <p>{language === 'ar'
                  ? "تحسين مستويات المخزون باستخدام رؤى الذكاء الاصطناعي."
                  : "Optimize inventory levels with AI insights."}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "تخطيط التسويق" : "Marketing Planning"}</strong>
                <p>{language === 'ar'
                  ? "تخطيط الحملات التسويقية باستخدام توصيات الذكاء الاصطناعي."
                  : "Plan marketing campaigns with AI recommendations."}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "أفضل الممارسات" : "Best Practices"}</h3>
            <ul>
              <li>{language === 'ar' ? "كن محدداً في استعلاماتك" : "Be specific in your queries"}</li>
              <li>{language === 'ar' ? "استخدم اللغة الطبيعية" : "Use natural language"}</li>
              <li>{language === 'ar' ? "راجع توصيات الذكاء الاصطناعي" : "Review AI recommendations"}</li>
            </ul>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
