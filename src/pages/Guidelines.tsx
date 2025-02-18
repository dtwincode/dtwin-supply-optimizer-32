
import DashboardLayout from "@/components/DashboardLayout";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { BookOpen, BarChart2, Users, Settings, Search } from "lucide-react";

const Guidelines = () => {
  const { language, isRTL } = useLanguage();

  const sections = [
    {
      icon: BookOpen,
      title: getTranslation("guidelines.gettingStarted", language),
      content: language === 'ar' 
        ? "تعرف على كيفية بدء استخدام أداة التنبؤ بالطلب وإعداد حسابك"
        : "Learn how to get started with the demand forecasting tool and set up your account"
    },
    {
      icon: BarChart2,
      title: getTranslation("guidelines.forecastingBasics", language),
      content: language === 'ar'
        ? "فهم أساسيات التنبؤ وكيفية استخدام الميزات الرئيسية"
        : "Understand forecasting basics and how to use key features"
    },
    {
      icon: Users,
      title: getTranslation("guidelines.collaboration", language),
      content: language === 'ar'
        ? "تعلم كيفية العمل مع فريقك ومشاركة التحليلات"
        : "Learn how to work with your team and share analytics"
    },
    {
      icon: Settings,
      title: getTranslation("guidelines.advanced", language),
      content: language === 'ar'
        ? "استكشف الميزات المتقدمة وأفضل الممارسات"
        : "Explore advanced features and best practices"
    },
    {
      icon: Search,
      title: getTranslation("guidelines.askAI", language),
      content: language === 'ar'
        ? "تعرف على كيفية استخدام مساعد الذكاء الاصطناعي للحصول على إجابات فورية"
        : "Learn how to use the AI assistant for instant answers"
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <h1 className="text-3xl font-semibold tracking-tight">
          {getTranslation("navigationItems.guidelines", language)}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language === 'ar'
            ? "دليل شامل لاستخدام منصة التنبؤ بالطلب"
            : "Comprehensive guide to using the demand forecasting platform"
          }
        </p>
        <Separator className="my-6" />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {section.content}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Guidelines;
