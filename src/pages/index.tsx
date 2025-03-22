
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { FinancialMetrics } from "@/components/dashboard/FinancialMetrics";
import { SustainabilityMetrics } from "@/components/dashboard/SustainabilityMetrics";
import { ModuleSummaryCards } from "@/components/dashboard/ModuleSummaryCards";
import { ExecutiveSummary } from "@/components/dashboard/ExecutiveSummary";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { IndustrySpecificKPIs } from "@/components/dashboard/IndustrySpecificKPIs";
import { useAuth } from "@/contexts/AuthContext";
import { useIndustry } from "@/contexts/IndustryContext";

export default function Index() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { isIndustrySelected } = useIndustry();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 sm:p-8">
        <div className="flex flex-col gap-4">
          <ExecutiveSummary />
          <DashboardMetrics />
        </div>
        
        {isIndustrySelected && <IndustrySpecificKPIs />}
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <FinancialMetrics />
          <SustainabilityMetrics />
        </div>
        
        <DashboardCharts />
        
        <ModuleSummaryCards />
      </div>
    </DashboardLayout>
  );
}
