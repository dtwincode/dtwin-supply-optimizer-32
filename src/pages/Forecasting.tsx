
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
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PeriodSelector } from "@/components/forecasting/date-range/PeriodSelector";
import { LocationFilter } from "@/components/forecasting/filters/LocationFilter";
import { ProductFilter } from "@/components/forecasting/filters/ProductFilter";
import { ForecastingDateRange } from "@/components/forecasting/ForecastingDateRange";
import { ForecastDataPoint } from "@/types/forecasting";

const Forecasting = () => {
  const [fromDate, setFromDate] = useState<Date>(new Date('2024-01-01'));
  const [toDate, setToDate] = useState<Date>(new Date('2024-12-26'));
  const [selectedL1MainProd, setSelectedL1MainProd] = useState<string>("all");
  const [selectedL2ProdLine, setSelectedL2ProdLine] = useState<string>("all");
  const [selectedL3ProdCategory, setSelectedL3ProdCategory] = useState<string>("all");
  const [selectedL4DeviceMake, setSelectedL4DeviceMake] = useState<string>("all");
  const [selectedL5ProdSubCategory, setSelectedL5ProdSubCategory] = useState<string>("all");
  const [selectedL6DeviceModel, setSelectedL6DeviceModel] = useState<string>("all");
  const [selectedL7DeviceColor, setSelectedL7DeviceColor] = useState<string>("all");
  const [selectedL8DeviceStorage, setSelectedL8DeviceStorage] = useState<string>("all");

  const dummyData = {
    filteredData: [{
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
      sku: "SKU123",
      l1_main_prod: "Electronics",
      l2_prod_line: "Mobile Devices",
      l3_prod_category: "Smartphones",
      l4_device_make: "Example Brand",
      l5_prod_sub_category: "Flagship",
      l6_device_model: "Model X",
      l7_device_color: "Black",
      l8_device_storage: "128GB"
    }] as ForecastDataPoint[],
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
    forecastTableData: [{
      date: "2024-01-01",
      value: 100,
      forecast: 105,
      sku: "SKU123",
      category: "Electronics",
      subcategory: "Phones",
      variance: 5,
      id: "1"
    }],
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

        <div className="px-6 space-y-6">
          {/* Filters Section */}
          <Card className="p-6">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Forecast Filters</h2>
              
              {/* Time Period Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Time Period</h3>
                <ForecastingDateRange
                  fromDate={fromDate}
                  toDate={toDate}
                  setFromDate={setFromDate}
                  setToDate={setToDate}
                />
              </div>

              {/* Product Hierarchy */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Product Hierarchy</h3>
                <ProductFilter
                  selectedL1MainProd={selectedL1MainProd}
                  setSelectedL1MainProd={setSelectedL1MainProd}
                  selectedL2ProdLine={selectedL2ProdLine}
                  setSelectedL2ProdLine={setSelectedL2ProdLine}
                  selectedL3ProdCategory={selectedL3ProdCategory}
                  setSelectedL3ProdCategory={setSelectedL3ProdCategory}
                  selectedL4DeviceMake={selectedL4DeviceMake}
                  setSelectedL4DeviceMake={setSelectedL4DeviceMake}
                  selectedL5ProdSubCategory={selectedL5ProdSubCategory}
                  setSelectedL5ProdSubCategory={setSelectedL5ProdSubCategory}
                  selectedL6DeviceModel={selectedL6DeviceModel}
                  setSelectedL6DeviceModel={setSelectedL6DeviceModel}
                  selectedL7DeviceColor={selectedL7DeviceColor}
                  setSelectedL7DeviceColor={setSelectedL7DeviceColor}
                  selectedL8DeviceStorage={selectedL8DeviceStorage}
                  setSelectedL8DeviceStorage={setSelectedL8DeviceStorage}
                  forecastData={dummyData.filteredData}
                />
              </div>
            </div>
          </Card>

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
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
