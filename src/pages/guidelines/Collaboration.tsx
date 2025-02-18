import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const Collaboration = () => {
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
          {language === 'ar' ? "التعاون" : "Collaboration"}
        </h1>
        
        <Separator className="my-6" />

        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>{language === 'ar' ? "العمل مع فريقك" : "Working with Your Team"}</h2>
            
            <h3>{language === 'ar' ? "مشاركة التوقعات" : "Sharing Forecasts"}</h3>
            <p>{language === 'ar'
              ? "تعرف على كيفية مشاركة التوقعات مع أعضاء فريقك للحصول على رؤى أفضل."
              : "Learn how to share forecasts with your team members for better insights."}
            </p>
            <ul>
              <li>
                <strong>{language === 'ar' ? "مشاركة المشاريع" : "Project Sharing"}</strong>
                <p>{language === 'ar'
                  ? "شارك مشاريع التنبؤ مع الزملاء"
                  : "Share forecasting projects with colleagues"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "أذونات الوصول" : "Access Permissions"}</strong>
                <p>{language === 'ar'
                  ? "إدارة أذونات الوصول لضمان أمان البيانات"
                  : "Manage access permissions to ensure data security"}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "التعاون في الوقت الفعلي" : "Real-Time Collaboration"}</h3>
            <p>{language === 'ar'
              ? "التعاون في الوقت الفعلي لتحسين دقة التوقعات."
              : "Collaborate in real-time to improve forecast accuracy."}
            </p>
            <ul>
              <li>
                <strong>{language === 'ar' ? "التعليقات والملاحظات" : "Comments and Feedback"}</strong>
                <p>{language === 'ar'
                  ? "تبادل التعليقات والملاحظات حول التوقعات"
                  : "Exchange comments and feedback on forecasts"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "تتبع التغييرات" : "Change Tracking"}</strong>
                <p>{language === 'ar'
                  ? "تتبع التغييرات التي يجريها أعضاء الفريق"
                  : "Track changes made by team members"}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "إدارة المستخدمين" : "User Management"}</h3>
            <p>{language === 'ar'
              ? "إدارة المستخدمين والأدوار داخل المنصة."
              : "Manage users and roles within the platform."}
            </p>
            <ul>
              <li>
                <strong>{language === 'ar' ? "إضافة مستخدمين جدد" : "Adding New Users"}</strong>
                <p>{language === 'ar'
                  ? "دعوة مستخدمين جدد للانضمام إلى فريقك"
                  : "Invite new users to join your team"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "إدارة الأدوار" : "Role Management"}</strong>
                <p>{language === 'ar'
                  ? "تعيين أدوار مختلفة للمستخدمين"
                  : "Assign different roles to users"}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "أفضل الممارسات" : "Best Practices"}</h3>
            <p>{language === 'ar'
              ? "نصائح لتحسين التعاون وتحقيق أقصى استفادة من المنصة."
              : "Tips for improving collaboration and maximizing the platform's benefits."}
            </p>
            <ul>
              <li>{language === 'ar' ? "تحديد الأدوار والمسؤوليات بوضوح" : "Clearly define roles and responsibilities"}</li>
              <li>{language === 'ar' ? "استخدام التعليقات بفعالية" : "Use comments effectively"}</li>
              <li>{language === 'ar' ? "مراجعة التوقعات بانتظام" : "Review forecasts regularly"}</li>
            </ul>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Collaboration;
