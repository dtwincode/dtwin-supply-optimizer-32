
import { ReturnsManagement } from "@/components/sales/ReturnsManagement";
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const ReturnsManagementPage = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {getTranslation('sales.returnsManagement', language) || "Returns Management"}
              </h1>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'تحليل وإدارة المرتجعات وتأثيرها على التنبؤ'
                  : 'Analyze and manage returns and their impact on forecasting'}
              </p>
            </div>
          </div>
        </div>

        <ReturnsManagement />
      </div>
    </DashboardLayout>
  );
};

export default ReturnsManagementPage;
