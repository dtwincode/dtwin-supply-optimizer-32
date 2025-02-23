
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import FinancialMetrics from "@/components/dashboard/FinancialMetrics";
import ModuleSummaryCards from "@/components/dashboard/ModuleSummaryCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import SustainabilityMetrics from "@/components/dashboard/SustainabilityMetrics";
import { memo } from "react";

const Index = () => {
  const { language, isRTL } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn" dir={isRTL ? 'rtl' : 'ltr'}>
        <section>
          <h3 className="font-display text-2xl font-semibold mb-4">
            {getTranslation('dashboard', language)}
          </h3>
          
          <MemoizedMetrics />
        </section>
      </div>
    </DashboardLayout>
  );
};

// Memoize the metrics components to prevent unnecessary re-renders
const MemoizedMetrics = memo(() => (
  <>
    <DashboardMetrics />
    <FinancialMetrics />
    <SustainabilityMetrics />
    <ModuleSummaryCards />
    <DashboardCharts />
  </>
));

MemoizedMetrics.displayName = 'MemoizedMetrics';

export default Index;
