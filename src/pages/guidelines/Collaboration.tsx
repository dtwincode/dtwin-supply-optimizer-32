
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
            
            <h3>{language === 'ar' ? "مشاركة التحليلات" : "Sharing Analytics"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "لوحات المعلومات المشتركة" : "Shared Dashboards"}</strong>
                <p>{language === 'ar'
                  ? "إنشاء ومشاركة لوحات معلومات مخصصة مع فريقك"
                  : "Create and share custom dashboards with your team"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "التقارير التلقائية" : "Automated Reports"}</strong>
                <p>{language === 'ar'
                  ? "جدولة وإرسال التقارير تلقائياً إلى أعضاء الفريق"
                  : "Schedule and automatically send reports to team members"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "التعليقات والملاحظات" : "Comments and Notes"}</strong>
                <p>{language === 'ar'
                  ? "إضافة تعليقات وملاحظات على التنبؤات والتحليلات"
                  : "Add comments and notes to forecasts and analyses"}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "إدارة الأدوار" : "Role Management"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "أدوار المستخدم" : "User Roles"}</strong>
                <p>{language === 'ar'
                  ? "تعيين أدوار وصلاحيات مختلفة لأعضاء الفريق"
                  : "Assign different roles and permissions to team members"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "سير العمل" : "Workflows"}</strong>
                <p>{language === 'ar'
                  ? "إنشاء وإدارة سير العمل للموافقات والمراجعات"
                  : "Create and manage workflows for approvals and reviews"}
                </p>
              </li>
            </ul>

            <h3>{language === 'ar' ? "التواصل" : "Communication"}</h3>
            <ul>
              <li>
                <strong>{language === 'ar' ? "التنبيهات" : "Alerts"}</strong>
                <p>{language === 'ar'
                  ? "إعداد تنبيهات مخصصة للأحداث المهمة"
                  : "Set up custom alerts for important events"}
                </p>
              </li>
              <li>
                <strong>{language === 'ar' ? "المناقشات" : "Discussions"}</strong>
                <p>{language === 'ar'
                  ? "بدء مناقشات حول التنبؤات والتحليلات"
                  : "Start discussions about forecasts and analyses"}
                </p>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Collaboration;
