import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

interface ForecastingTabsProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const ForecastingTabs: React.FC<ForecastingTabsProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // If activeTab and setActiveTab are provided, use those
  // Otherwise, use the route-based navigation
  const handleTabChange = (value: string) => {
    if (setActiveTab) {
      setActiveTab(value);
    } else {
      const basePath = "/forecasting";
      const path = value === "analysis" 
        ? basePath 
        : `${basePath}/${value}`;
      navigate(path);
    }
  };
  
  // If activeTab is not provided, determine it from the route
  const currentActiveTab = activeTab || (() => {
    const path = location.pathname;
    if (path.includes("distribution")) return "distribution";
    if (path.includes("what-if")) return "what-if";
    if (path.includes("external")) return "external";
    return "analysis";
  })();

  return (
    <Tabs value={currentActiveTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="analysis">
          Forecast Analysis
        </TabsTrigger>
        <TabsTrigger value="distribution">
          Forecast Distribution
        </TabsTrigger>
        <TabsTrigger value="what-if">
          What-If Analysis
        </TabsTrigger>
        <TabsTrigger value="external">
          External Factors
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
