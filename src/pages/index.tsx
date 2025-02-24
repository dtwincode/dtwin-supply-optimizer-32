
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import FinancialMetrics from "@/components/dashboard/FinancialMetrics";
import ModuleSummaryCards from "@/components/dashboard/ModuleSummaryCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import SustainabilityMetrics from "@/components/dashboard/SustainabilityMetrics";
import { memo, Suspense, useState, useEffect } from "react";
import { cn } from "@/lib/utils";  // Added this import

const LoadingFallback = () => (
  <div className="min-h-screen bg-background animate-in fade-in duration-300">
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingFallback />}>
        <div 
          className={cn(
            "space-y-6 transition-all duration-300 ease-in-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} 
          dir={isRTL ? 'rtl' : 'ltr'}
        >
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
