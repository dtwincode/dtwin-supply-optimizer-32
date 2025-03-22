
import React from "react";
import { ForecastingTabs } from "./ForecastingTabs";
import { ForecastingHeader } from "./ForecastingHeader";
import { ForecastChart } from "./ForecastChart";
import { ForecastMetricsCards } from "./ForecastMetricsCards";
import { ForecastTable } from "./ForecastTable";
import { ForecastFilters } from "./ForecastFilters";
import { ModelSelectionCard } from "./ModelSelectionCard";
import { ScenarioManagement } from "./ScenarioManagement";
import { ForecastingDateRange } from "./ForecastingDateRange";
import { ModelVersioning } from "./ModelVersioning";
import { ErrorDistribution } from "./components/ErrorDistribution";
import { ModelRecommendations } from "./components/ModelRecommendations";
import { AnomalyDetection } from "./components/AnomalyDetection";
import { PharmacyForecastingFactors } from "./PharmacyForecastingFactors";
import { useIndustry } from "@/contexts/IndustryContext";

interface ForecastingContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ForecastingContainer: React.FC<ForecastingContainerProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { selectedIndustry } = useIndustry();
  
  return (
    <div className="space-y-6">
      <ForecastingHeader />
      <ForecastingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <ForecastMetricsCards />
          <ForecastFilters />
          <ForecastChart />
          <ForecastingDateRange />
          {selectedIndustry === 'pharmacy' && <PharmacyForecastingFactors />}
          <ForecastTable />
        </div>
      )}

      {activeTab === "models" && (
        <div className="space-y-6">
          <ModelSelectionCard />
          <ModelVersioning />
          <ErrorDistribution />
          <ModelRecommendations />
          {selectedIndustry === 'pharmacy' && <PharmacyForecastingFactors />}
        </div>
      )}

      {activeTab === "scenarios" && (
        <div className="space-y-6">
          <ScenarioManagement />
          <AnomalyDetection />
          {selectedIndustry === 'pharmacy' && <PharmacyForecastingFactors />}
        </div>
      )}
    </div>
  );
};
