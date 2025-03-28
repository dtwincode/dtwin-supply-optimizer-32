
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import FinancialMetrics from "@/components/dashboard/FinancialMetrics";
import ModuleSummaryCards from "@/components/dashboard/ModuleSummaryCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import SustainabilityMetrics from "@/components/dashboard/SustainabilityMetrics";
import ExecutiveSummary from "@/components/dashboard/ExecutiveSummary";
import { memo, Suspense, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const LoadingFallback = () => (
  <div className="fixed inset-0 bg-background animate-in fade-in duration-500">
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

// Add debug logging
console.log("Index module loading", new Date().toISOString());

const Index = () => {
  console.log("Index component rendering", new Date().toISOString());
  const { language, isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log("Index component mounted", new Date().toISOString());
    // Increased delay for smoother transition
    const timer = setTimeout(() => {
      setIsVisible(true);
      console.log("Index component visibility set to true");
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingFallback />}>
        <div 
          className={cn(
            "space-y-2 transition-all duration-500 ease-in-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} 
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <section className="transition-opacity duration-500">
            <h2 className="font-display text-xl font-semibold mb-2">
              {getTranslation('dashboard.title', language)}
            </h2>
            
            <MemoizedMetrics />
          </section>
        </div>
      </Suspense>
    </DashboardLayout>
  );
};

const MemoizedMetrics = memo(() => {
  console.log("MemoizedMetrics rendering");
  return (
    <div className="transition-all duration-500 ease-in-out space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardMetrics />
        </div>
        <div className="flex flex-col space-y-4">
          <FinancialMetrics />
          <SustainabilityMetrics />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <ExecutiveSummary />
        <ModuleSummaryCards />
        <DashboardCharts />
      </div>
    </div>
  );
});

MemoizedMetrics.displayName = 'MemoizedMetrics';

export default Index;
