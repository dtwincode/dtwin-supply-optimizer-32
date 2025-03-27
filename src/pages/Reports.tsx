
import DashboardLayout from "@/components/DashboardLayout";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/contexts/I18nContext";

const Reports = () => {
  const { language } = useLanguage();
  const { t } = useI18n();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'إنشاء وإدارة التقارير التحليلية'
              : t('reports.description') || 'Generate and manage analytical reports'}
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
