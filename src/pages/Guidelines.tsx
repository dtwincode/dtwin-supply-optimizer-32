import DashboardLayout from "@/components/DashboardLayout";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart2, Users, Settings, Search, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { MaturityAssessmentMap } from "@/components/guidelines/MaturityAssessmentMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Guidelines = () => {
  const {
    language,
    isRTL
  } = useLanguage();
  const sections = [{
    icon: BarChart2,
    title: language === 'ar' ? "أساسيات التنبؤ" : "Forecasting Basics",
    content: language === 'ar' ? "فهم أساسيات التنبؤ وكيفية استخدام الميزات الرئيسية" : "Understand forecasting basics and how to use key features",
    href: "/guidelines/forecasting-basics"
  }, {
    icon: Users,
    title: language === 'ar' ? "التعاون" : "Collaboration",
    content: language === 'ar' ? "تعلم كيفية العمل مع فريقك ومشاركة التحليلات" : "Learn how to work with your team and share analytics",
    href: "/guidelines/collaboration"
  }, {
    icon: Settings,
    title: language === 'ar' ? "الميزات المتقدمة" : "Advanced Features",
    content: language === 'ar' ? "استكشف الميزات المتقدمة وأفضل الممارسات" : "Explore advanced features and best practices",
    href: "/guidelines/advanced"
  }, {
    icon: Search,
    title: language === 'ar' ? "مساعد الذكاء الاصطناعي" : "AI Assistant",
    content: language === 'ar' ? "تعرف على كيفية استخدام مساعد الذكاء الاصطناعي للحصول على إجابات فورية" : "Learn how to use the AI assistant for instant answers",
    href: "/guidelines/ai-assistant"
  }, {
    icon: BookOpen,
    title: language === 'ar' ? "البدء والإعداد" : "Getting Started",
    content: language === 'ar' ? "تعرف على كيفية بدء استخدام أداة التنبؤ بالطلب وإعداد حسابك" : "Learn how to get started with the demand forecasting tool and set up your account",
    href: "/guidelines/getting-started"
  }];
  return <DashboardLayout>
      <div className="flex flex-col p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <h1 className="text-3xl font-semibold tracking-tight">
          {language === 'ar' ? "الدليل الإرشادي" : "Guidelines"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {language === 'ar' ? "دليل شامل لاستخدام منصة التنبؤ بالطلب" : "Comprehensive guide to using the demand forecasting platform"}
        </p>
        <Separator className="my-6" />
        
        <Tabs defaultValue="guidelines" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="guidelines">
              {language === 'ar' ? "الإرشادات" : "Guidelines"}
            </TabsTrigger>
            
          </TabsList>
          
          <TabsContent value="guidelines">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((section, index) => {
              const Icon = section.icon;
              return <Link key={index} to={section.href}>
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
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
                  </Link>;
            })}
            </div>
          </TabsContent>
          
          <TabsContent value="maturity">
            <MaturityAssessmentMap />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>;
};
export { Guidelines };