
import DashboardLayout from "@/components/DashboardLayout";
import { ForecastingTabs } from "@/components/forecasting/ForecastingTabs";
import { ForecastAnalysisTab } from "@/components/forecasting/tabs/ForecastAnalysisTab";
import { ForecastDistributionTab } from "@/components/forecasting/tabs/ForecastDistributionTab";
import { DecompositionTab } from "@/components/forecasting/tabs/DecompositionTab";
import { WhatIfAnalysisTab } from "@/components/forecasting/tabs/WhatIfAnalysisTab";
import { ValidationTab } from "@/components/forecasting/tabs/ValidationTab";
import { ExternalFactorsTab } from "@/components/forecasting/tabs/ExternalFactorsTab";
import { Separator } from "@/components/ui/separator";
import { Route, Routes, Navigate } from "react-router-dom";

const Forecasting = () => {
  const dummyData = {
    filteredData: [],
    confidenceIntervals: [],
    decomposition: {},
    validationResults: {},
    crossValidationResults: {},
    weatherLocation: "",
    setWeatherLocation: () => {},
    weatherData: {},
    fetchWeatherForecast: async () => {},
    marketEvents: [],
    setMarketEvents: () => {},
    newEvent: {},
    setNewEvent: () => {},
    priceAnalysis: {},
    historicalPriceData: [],
    addHistoricalPricePoint: () => {},
    calculatePriceAnalysis: () => {},
    forecastTableData: [],
    whatIfScenario: []
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

        <ForecastingTabs />

        <div className="p-6">
          <Routes>
            <Route 
              path="/" 
              element={
                <ForecastAnalysisTab 
                  filteredData={dummyData.filteredData}
                  confidenceIntervals={dummyData.confidenceIntervals}
                />
              } 
            />
            <Route 
              path="/distribution" 
              element={
                <ForecastDistributionTab 
                  forecastTableData={dummyData.forecastTableData}
                />
              } 
            />
            <Route 
              path="/pattern" 
              element={
                <DecompositionTab
                  filteredData={dummyData.filteredData}
                  decomposition={dummyData.decomposition}
                />
              } 
            />
            <Route 
              path="/what-if" 
              element={
                <WhatIfAnalysisTab
                  filteredData={dummyData.filteredData}
                  whatIfScenario={dummyData.whatIfScenario}
                />
              } 
            />
            <Route 
              path="/validation" 
              element={
                <ValidationTab
                  validationResults={dummyData.validationResults}
                  crossValidationResults={dummyData.crossValidationResults}
                />
              } 
            />
            <Route 
              path="/external" 
              element={
                <ExternalFactorsTab
                  weatherLocation={dummyData.weatherLocation}
                  setWeatherLocation={dummyData.setWeatherLocation}
                  weatherData={dummyData.weatherData}
                  fetchWeatherForecast={dummyData.fetchWeatherForecast}
                  marketEvents={dummyData.marketEvents}
                  setMarketEvents={dummyData.setMarketEvents}
                  newEvent={dummyData.newEvent}
                  setNewEvent={dummyData.setNewEvent}
                  priceAnalysis={dummyData.priceAnalysis}
                  addHistoricalPricePoint={dummyData.addHistoricalPricePoint}
                  calculatePriceAnalysis={dummyData.calculatePriceAnalysis}
                  historicalPriceData={dummyData.historicalPriceData}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/forecasting" replace />} />
          </Routes>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
