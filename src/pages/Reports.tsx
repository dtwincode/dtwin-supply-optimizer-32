
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
          <h1 className="text-2xl font-bold">
            Supply Chain Dashboard
          </h1>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{getTranslation('navigationItems.reports', language)}</h2>
          </div>
        </div>
        <Card className="p-6">
          <ReportGenerator />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
