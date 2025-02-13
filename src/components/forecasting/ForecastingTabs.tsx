
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForecastAnalysisTab } from "./tabs/ForecastAnalysisTab";
import { ForecastDistributionTab } from "./tabs/ForecastDistributionTab";
import { DecompositionTab } from "./tabs/DecompositionTab";
import { WhatIfAnalysisTab } from "./tabs/WhatIfAnalysisTab";
import { ValidationTab } from "./tabs/ValidationTab";
import { ExternalFactorsTab } from "./tabs/ExternalFactorsTab";
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="mt-4">
      <Tabs defaultValue="forecast" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full p-0 bg-muted/5 rounded-none border-b">
          <TabsTrigger value="forecast" className="rounded-none data-[state=active]:bg-background">
            Forecast Analysis
          </TabsTrigger>
          <TabsTrigger value="distribution" className="rounded-none data-[state=active]:bg-background">
            Distribution
          </TabsTrigger>
          <TabsTrigger value="decomposition" className="rounded-none data-[state=active]:bg-background">
            Pattern Analysis
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="rounded-none data-[state=active]:bg-background">
            What-If Analysis
          </TabsTrigger>
          <TabsTrigger value="validation" className="rounded-none data-[state=active]:bg-background">
            Model Validation
          </TabsTrigger>
          <TabsTrigger value="external" className="rounded-none data-[state=active]:bg-background">
            External Factors
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="forecast" className="mt-0">
            <ForecastAnalysisTab
              filteredData={filteredData}
              confidenceIntervals={confidenceIntervals}
            />
          </TabsContent>

          <TabsContent value="distribution" className="mt-0">
            <ForecastDistributionTab forecastTableData={forecastTableData} />
          </TabsContent>

          <TabsContent value="decomposition" className="mt-0">
            <DecompositionTab
              filteredData={filteredData}
              decomposition={decomposition}
            />
          </TabsContent>

          <TabsContent value="scenarios" className="mt-0">
            <WhatIfAnalysisTab
              filteredData={filteredData}
              whatIfScenario={[]}
            />
          </TabsContent>

          <TabsContent value="validation" className="mt-0">
            <ValidationTab
              validationResults={validationResults}
              crossValidationResults={crossValidationResults}
            />
          </TabsContent>

          <TabsContent value="external" className="mt-0">
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
        </div>
      </Tabs>
    </Card>
  );
};
