
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
            "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6 space-y-8 transition-all duration-500 ease-in-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} 
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <section className="transition-opacity duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {getTranslation('navigation.dashboard', language)}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Welcome to your supply chain control center</p>
              </div>
            </div>
            
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
    <div className="transition-all duration-500 ease-in-out space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardMetrics />
        </div>
        <div className="flex flex-col space-y-6">
          <FinancialMetrics />
          <SustainabilityMetrics />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ModuleSummaryCards />
        <ExecutiveSummary />
        <DashboardCharts />
      </div>
    </div>
  );
});

MemoizedMetrics.displayName = 'MemoizedMetrics';

export default Index;
