
import DashboardLayout from "@/components/DashboardLayout";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const Reports = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{getTranslation('navigationItems.reports', language)}</h1>
        </div>
        <Card className="p-6">
          <ReportGenerator />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
