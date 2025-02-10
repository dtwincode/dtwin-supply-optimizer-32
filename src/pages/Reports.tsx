
import DashboardLayout from "@/components/DashboardLayout";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const Reports = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'إنشاء وإدارة التقارير التحليلية'
              : 'Generate and manage analytical reports'}
          </p>
        </div>
        <Card className="p-6">
          <ReportGenerator />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
