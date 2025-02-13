
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
    filteredData: [
      {
        id: "1",
        week: "2024-01-01",
        actual: 100,
        forecast: 105,
        variance: 5,
        region: "North",
        city: "Example City",
        channel: "Retail",
        warehouse: "Main",
        category: "Electronics",
        subcategory: "Phones",
        sku: "SKU123"
      }
    ],
    confidenceIntervals: [
      { upper: 110, lower: 90 }
    ],
    decomposition: {
      trend: [100, 105, 110],
      seasonal: [5, -5, 0]
    },
    validationResults: {
      biasTest: true,
      residualNormality: true,
      heteroskedasticityTest: true
    },
    crossValidationResults: {
      trainMetrics: { mape: 5, mae: 3, rmse: 4 },
      testMetrics: { mape: 6, mae: 4, rmse: 5 },
      validationMetrics: { mape: 5.5, mae: 3.5, rmse: 4.5 }
    },
    weatherLocation: "New York",
    setWeatherLocation: (location: string) => {},
    weatherData: {
      temperature: 20,
      precipitation: 0,
      humidity: 65,
      windSpeed: 10,
      weatherCondition: "Clear"
    },
    fetchWeatherForecast: async (location: string) => ({
      temperature: 20,
      precipitation: 0,
      humidity: 65,
      windSpeed: 10,
      weatherCondition: "Clear"
    }),
    marketEvents: [],
    setMarketEvents: () => {},
    newEvent: {},
    setNewEvent: () => {},
    priceAnalysis: {
      priceElasticity: -1.2,
      optimalPrice: 99.99,
      priceThresholds: {
        min: 89.99,
        max: 109.99,
        optimal: 99.99
      }
    },
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
            <Route path="/forecasting" element={<ForecastAnalysisTab 
              filteredData={dummyData.filteredData}
              confidenceIntervals={dummyData.confidenceIntervals}
            />} />
            <Route path="/forecasting/distribution" element={<ForecastDistributionTab 
              forecastTableData={dummyData.forecastTableData}
            />} />
            <Route path="/forecasting/pattern" element={<DecompositionTab
              filteredData={dummyData.filteredData}
              decomposition={dummyData.decomposition}
            />} />
            <Route path="/forecasting/what-if" element={<WhatIfAnalysisTab
              filteredData={dummyData.filteredData}
              whatIfScenario={dummyData.whatIfScenario}
            />} />
            <Route path="/forecasting/validation" element={<ValidationTab
              validationResults={dummyData.validationResults}
              crossValidationResults={dummyData.crossValidationResults}
            />} />
            <Route path="/forecasting/external" element={<ExternalFactorsTab
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
            />} />
            <Route path="/" element={<Navigate to="/forecasting" replace />} />
            <Route path="*" element={<Navigate to="/forecasting" replace />} />
          </Routes>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
