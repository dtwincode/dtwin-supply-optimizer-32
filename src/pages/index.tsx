
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import FinancialMetrics from "@/components/dashboard/FinancialMetrics";
import ModuleSummaryCards from "@/components/dashboard/ModuleSummaryCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import SustainabilityMetrics from "@/components/dashboard/SustainabilityMetrics";
import { memo, Suspense } from "react";

const LoadingFallback = () => (
  <div className="min-h-screen bg-background">
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const Index = () => {
  const { language, isRTL } = useLanguage();

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingFallback />}>
        <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <section>
            <h3 className="font-display text-2xl font-semibold mb-4">
              {getTranslation('dashboard', language)}
            </h3>
            
            <MemoizedMetrics />
          </section>
        </div>
      </Suspense>
    </DashboardLayout>
  );
};

// Memoize the metrics components to prevent unnecessary re-renders
const MemoizedMetrics = memo(() => (
  <div className="transition-opacity duration-300">
    <DashboardMetrics />
    <FinancialMetrics />
    <SustainabilityMetrics />
    <ModuleSummaryCards />
    <DashboardCharts />
  </div>
));

MemoizedMetrics.displayName = 'MemoizedMetrics';

export default Index;
