
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import FinancialMetrics from "@/components/dashboard/FinancialMetrics";
import ModuleSummaryCards from "@/components/dashboard/ModuleSummaryCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import SustainabilityMetrics from "@/components/dashboard/SustainabilityMetrics";

const Index = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        <section>
          <h3 className="font-display text-2xl font-semibold mb-4">
            {getTranslation('dashboard', language)}
          </h3>
          
          <DashboardMetrics />
          <FinancialMetrics />
          <SustainabilityMetrics />
          <ModuleSummaryCards />
          <DashboardCharts />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;

