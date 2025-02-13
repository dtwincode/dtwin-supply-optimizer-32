
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForecastAnalysisTab } from "./tabs/ForecastAnalysisTab";
import { ForecastDistributionTab } from "./tabs/ForecastDistributionTab";
import { DecompositionTab } from "./tabs/DecompositionTab";
import { WhatIfAnalysisTab } from "./tabs/WhatIfAnalysisTab";
import { ValidationTab } from "./tabs/ValidationTab";
import { ExternalFactorsTab } from "./tabs/ExternalFactorsTab";

interface ForecastingTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  historicalData: any[];
  filteredData: any[];
  confidenceIntervals: { upper: number; lower: number }[];
  decomposition: any;
  validationResults: any;
  crossValidationResults: any;
  weatherLocation: string;
  setWeatherLocation: (location: string) => void;
  weatherData: any;
  fetchWeatherForecast: () => Promise<any>;
  marketEvents: any[];
  setMarketEvents: (events: any[]) => void;
  newEvent: any;
  setNewEvent: (event: any) => void;
  priceAnalysis: any;
  historicalPriceData: any[];
  addHistoricalPricePoint: (price: number, demand: number) => void;
  calculatePriceAnalysis: () => void;
  forecastTableData: any[];
}

export const ForecastingTabs = ({
  activeTab,
  setActiveTab,
  historicalData,
  filteredData,
  confidenceIntervals,
  decomposition,
  validationResults,
  crossValidationResults,
  weatherLocation,
  setWeatherLocation,
  weatherData,
  fetchWeatherForecast,
  marketEvents,
  setMarketEvents,
  newEvent,
  setNewEvent,
  priceAnalysis,
  historicalPriceData,
  addHistoricalPricePoint,
  calculatePriceAnalysis,
  forecastTableData,
}: ForecastingTabsProps) => {
  console.log('Active tab:', activeTab); // Debug log

  return (
    <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="analysis">Forecast Performance</TabsTrigger>
        <TabsTrigger value="distribution">Statistical Analysis</TabsTrigger>
        <TabsTrigger value="decomposition">Trend Analysis</TabsTrigger>
        <TabsTrigger value="scenarios">Scenario Planning</TabsTrigger>
        <TabsTrigger value="accuracy">Model Accuracy</TabsTrigger>
        <TabsTrigger value="factors">External Influences</TabsTrigger>
      </TabsList>

      <TabsContent value="analysis">
        <ForecastAnalysisTab
          filteredData={filteredData}
          confidenceIntervals={confidenceIntervals}
        />
      </TabsContent>

      <TabsContent value="distribution">
        <ForecastDistributionTab forecastTableData={forecastTableData} />
      </TabsContent>

      <TabsContent value="decomposition">
        <DecompositionTab
          filteredData={filteredData}
          decomposition={decomposition}
        />
      </TabsContent>

      <TabsContent value="scenarios">
        <WhatIfAnalysisTab
          filteredData={filteredData}
          whatIfScenario={[]}
        />
      </TabsContent>

      <TabsContent value="accuracy">
        <ValidationTab
          validationResults={validationResults}
          crossValidationResults={crossValidationResults}
        />
      </TabsContent>

      <TabsContent value="factors">
        <ExternalFactorsTab
          weatherLocation={weatherLocation}
          setWeatherLocation={setWeatherLocation}
          weatherData={weatherData}
          fetchWeatherForecast={fetchWeatherForecast}
          marketEvents={marketEvents}
          setMarketEvents={setMarketEvents}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          priceAnalysis={priceAnalysis}
          addHistoricalPricePoint={addHistoricalPricePoint}
          calculatePriceAnalysis={calculatePriceAnalysis}
          historicalPriceData={historicalPriceData}
        />
      </TabsContent>
    </Tabs>
  );
};
