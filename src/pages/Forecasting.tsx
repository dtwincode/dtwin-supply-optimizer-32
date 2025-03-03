
import DashboardLayout from "@/components/DashboardLayout";
import { ForecastingTabs } from "@/components/forecasting/ForecastingTabs";
import ForecastAnalysisTab from "@/components/forecasting/tabs/ForecastAnalysisTab";
import { ForecastDistributionTab } from "@/components/forecasting/tabs/ForecastDistributionTab";
import { WhatIfAnalysisTab } from "@/components/forecasting/tabs/WhatIfAnalysisTab";
import { ExternalFactorsTab } from "@/components/forecasting/tabs/ExternalFactorsTab";
import { Separator } from "@/components/ui/separator";
import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { FiltersSection } from "@/components/forecasting/components/FiltersSection";
import { dummyData } from "@/data/forecastDummyData";

const Forecasting = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const [isProductExpanded, setIsProductExpanded] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);

  const getStorageKey = (base: string) => `${base}_${currentPath.split('/').pop() || 'analysis'}`;

  const [trainingFromDate, setTrainingFromDate] = useLocalStorage(
    getStorageKey('trainingFromDate'),
    new Date('2024-01-01').toISOString()
  );
  const [trainingToDate, setTrainingToDate] = useLocalStorage(
    getStorageKey('trainingToDate'),
    new Date('2024-09-30').toISOString()
  );
  const [testingFromDate, setTestingFromDate] = useLocalStorage(
    getStorageKey('testingFromDate'),
    new Date('2024-10-01').toISOString()
  );
  const [testingToDate, setTestingToDate] = useLocalStorage(
    getStorageKey('testingToDate'),
    new Date('2024-12-31').toISOString()
  );

  const handleSectionToggle = (section: 'time' | 'product' | 'location') => {
    switch (section) {
      case 'time':
        setIsTimeExpanded(!isTimeExpanded);
        break;
      case 'product':
        setIsProductExpanded(!isProductExpanded);
        break;
      case 'location':
        setIsLocationExpanded(!isLocationExpanded);
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="px-6 py-6">
          <h1 className="text-3xl font-semibold tracking-tight">Demand Forecasting</h1>
          <p className="text-muted-foreground mt-2">
            Analyze, predict, and optimize your demand forecasts with advanced analytics
          </p>
          <Separator className="my-6" />
        </div>

        <div className="px-6">
          <ForecastingTabs />
        </div>

        <FiltersSection 
          isTimeExpanded={isTimeExpanded}
          isProductExpanded={isProductExpanded}
          isLocationExpanded={isLocationExpanded}
          handleSectionToggle={handleSectionToggle}
          trainingFromDate={trainingFromDate}
          trainingToDate={trainingToDate}
          testingFromDate={testingFromDate}
          testingToDate={testingToDate}
          setTrainingFromDate={setTrainingFromDate}
          setTrainingToDate={setTrainingToDate}
          setTestingFromDate={setTestingFromDate}
          setTestingToDate={setTestingToDate}
        />

        <div className="px-6 mt-6">
          <Routes>
            <Route index element={<ForecastAnalysisTab />} />
            <Route path="distribution" element={<ForecastDistributionTab forecastTableData={dummyData.forecastTableData} />} />
            <Route path="what-if" element={<WhatIfAnalysisTab filteredData={dummyData.filteredData} whatIfScenario={dummyData.whatIfScenario} />} />
            <Route path="external" element={<ExternalFactorsTab {...dummyData} />} />
          </Routes>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
