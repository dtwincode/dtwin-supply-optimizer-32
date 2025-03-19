
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { SupplyPlanningTabs } from "@/components/supply-planning/SupplyPlanningTabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { Navigate } from "react-router-dom";

const SupplyPlanning = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {getTranslation("navigationItems.supplyPlanning", language)}
        </h1>
        <p className="text-muted-foreground">
          {getTranslation("modulesSummary.supplyPlanningDescription", language)}
        </p>
        <SupplyPlanningTabs />
      </div>
    </DashboardLayout>
  );
};

export default SupplyPlanning;
