
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { SupplyPlanningTabs } from "@/components/supply-planning/SupplyPlanningTabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { Navigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const SupplyPlanning = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-dtwin-medium/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-dtwin-dark" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-dtwin-dark to-dtwin-medium bg-clip-text text-transparent">
            {getTranslation("navigationItems.supplyPlanning", language)}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {getTranslation("supplyPlanning.moduleDescription", language)}
        </p>
        <SupplyPlanningTabs />
      </div>
    </DashboardLayout>
  );
};

export default SupplyPlanning;
