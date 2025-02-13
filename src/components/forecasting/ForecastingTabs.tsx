
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForecastAnalysisTab } from "./tabs/ForecastAnalysisTab";
import { ForecastDistributionTab } from "./tabs/ForecastDistributionTab";
import { DecompositionTab } from "./tabs/DecompositionTab";
import { WhatIfAnalysisTab } from "./tabs/WhatIfAnalysisTab";
import { ValidationTab } from "./tabs/ValidationTab";
import { ExternalFactorsTab } from "./tabs/ExternalFactorsTab";
import { useNavigate } from "react-router-dom";

interface ForecastingTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ForecastingTabs = ({
  activeTab,
  setActiveTab,
}: ForecastingTabsProps) => {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/forecasting/${value}`);
  };

  return (
    <Tabs defaultValue="forecast" value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="forecast">Forecast Analysis</TabsTrigger>
        <TabsTrigger value="distribution">Forecast Distribution</TabsTrigger>
        <TabsTrigger value="decomposition">Pattern Analysis</TabsTrigger>
        <TabsTrigger value="scenarios">What-If Analysis</TabsTrigger>
        <TabsTrigger value="validation">Forecast Validation</TabsTrigger>
        <TabsTrigger value="external">External Factors</TabsTrigger>
      </TabsList>

      <TabsContent value="forecast">
        <ForecastAnalysisTab />
      </TabsContent>

      <TabsContent value="distribution">
        <ForecastDistributionTab />
      </TabsContent>

      <TabsContent value="decomposition">
        <DecompositionTab />
      </TabsContent>

      <TabsContent value="scenarios">
        <WhatIfAnalysisTab />
      </TabsContent>

      <TabsContent value="validation">
        <ValidationTab />
      </TabsContent>

      <TabsContent value="external">
        <ExternalFactorsTab />
      </TabsContent>
    </Tabs>
  );
};
