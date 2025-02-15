import DashboardLayout from "@/components/DashboardLayout";
import { ForecastingTabs } from "@/components/forecasting/ForecastingTabs";
import { ForecastAnalysisTab } from "@/components/forecasting/tabs/ForecastAnalysisTab";
import { ForecastDistributionTab } from "@/components/forecasting/tabs/ForecastDistributionTab";
import { DescriptiveAnalysisTab } from "@/components/forecasting/tabs/DescriptiveAnalysisTab";
import { DecompositionTab } from "@/components/forecasting/tabs/DecompositionTab";
import { WhatIfAnalysisTab } from "@/components/forecasting/tabs/WhatIfAnalysisTab";
import { ValidationTab } from "@/components/forecasting/tabs/ValidationTab";
import { ExternalFactorsTab } from "@/components/forecasting/tabs/ExternalFactorsTab";
import { Separator } from "@/components/ui/separator";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ProductFilter } from "@/components/forecasting/filters/ProductFilter";
import { LocationFilter } from "@/components/forecasting/filters/LocationFilter";
import { ForecastDataPoint } from "@/types/forecasting";
import { Card } from "@/components/ui/card";
import { ForecastingDateRange } from "@/components/forecasting/ForecastingDateRange";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Forecasting = () => {
  const [isTimeExpanded, setIsTimeExpanded] = useState(false);
  const [isProductExpanded, setIsProductExpanded] = useState(false);
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  
  // Product hierarchy states
  const [selectedL1MainProd, setSelectedL1MainProd] = useState<string>("all");
  const [selectedL2ProdLine, setSelectedL2ProdLine] = useState<string>("all");
  const [selectedL3ProdCategory, setSelectedL3ProdCategory] = useState<string>("all");
  const [selectedL4DeviceMake, setSelectedL4DeviceMake] = useState<string>("all");
  const [selectedL5ProdSubCategory, setSelectedL5ProdSubCategory] = useState<string>("all");
  const [selectedL6DeviceModel, setSelectedL6DeviceModel] = useState<string>("all");
  const [selectedL7DeviceColor, setSelectedL7DeviceColor] = useState<string>("all");
  const [selectedL8DeviceStorage, setSelectedL8DeviceStorage] = useState<string>("all");

  // Location hierarchy states
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  // Time period states
  const [trainingFromDate, setTrainingFromDate] = useState<Date>(new Date('2024-01-01'));
  const [trainingToDate, setTrainingToDate] = useState<Date>(new Date('2024-09-30'));
  const [testingFromDate, setTestingFromDate] = useState<Date>(new Date('2024-10-01'));
  const [testingToDate, setTestingToDate] = useState<Date>(new Date('2024-12-31'));

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

        <div className="px-6">
          <ForecastingTabs />
        </div>

        <div className="px-6 space-y-6 mt-6">
          <div 
            className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40"
            onMouseLeave={() => setIsTimeExpanded(false)}
          >
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
              onClick={() => setIsTimeExpanded(!isTimeExpanded)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-primary">Time Period Selection</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {isTimeExpanded ? "Click to collapse" : "Click to expand"}
                </span>
                {isTimeExpanded ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary" />
                )}
              </div>
            </Button>

            <AnimatePresence>
              {isTimeExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-6 border-t bg-primary/5">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <h4 className="text-base font-medium mb-4">Training Period</h4>
                        <ForecastingDateRange
                          fromDate={trainingFromDate}
                          toDate={trainingToDate}
                          setFromDate={setTrainingFromDate}
                          setToDate={setTrainingToDate}
                        />
                      </Card>
                      <Card className="p-6">
                        <h4 className="text-base font-medium mb-4">Testing Period</h4>
                        <ForecastingDateRange
                          fromDate={testingFromDate}
                          toDate={testingToDate}
                          setFromDate={setTestingFromDate}
                          setToDate={setTestingToDate}
                        />
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div 
            className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40"
            onMouseLeave={() => setIsProductExpanded(false)}
          >
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
              onClick={() => setIsProductExpanded(!isProductExpanded)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-primary">Product Hierarchy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {isProductExpanded ? "Click to collapse" : "Click to expand"}
                </span>
                {isProductExpanded ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary" />
                )}
              </div>
            </Button>

            <AnimatePresence>
              {isProductExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-6 border-t bg-primary/5">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div 
            className="w-full relative bg-background rounded-lg border-2 border-primary/20 shadow-lg transition-all duration-300 hover:border-primary/40"
            onMouseLeave={() => setIsLocationExpanded(false)}
          >
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-6 hover:bg-primary/5"
              onClick={() => setIsLocationExpanded(!isLocationExpanded)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-primary">Location Hierarchy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {isLocationExpanded ? "Click to collapse" : "Click to expand"}
                </span>
                {isLocationExpanded ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary" />
                )}
              </div>
            </Button>

            <AnimatePresence>
              {isLocationExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-6 border-t bg-primary/5">
                    <LocationFilter
                      selectedRegion={selectedRegion}
                      setSelectedRegion={setSelectedRegion}
                      selectedCity={selectedCity}
                      setSelectedCity={setSelectedCity}
                      regions={[]}
                      cities={{}}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Routes>
            <Route index element={<ForecastAnalysisTab filteredData={dummyData.filteredData} confidenceIntervals={dummyData.confidenceIntervals} />} />
            <Route path="distribution" element={<ForecastDistributionTab forecastTableData={dummyData.forecastTableData} />} />
            <Route path="descriptive" element={<DescriptiveAnalysisTab filteredData={dummyData.filteredData} />} />
            <Route path="pattern" element={<DecompositionTab filteredData={dummyData.filteredData} decomposition={dummyData.decomposition} />} />
            <Route path="what-if" element={<WhatIfAnalysisTab filteredData={dummyData.filteredData} whatIfScenario={dummyData.whatIfScenario} />} />
            <Route path="validation" element={<ValidationTab validationResults={dummyData.validationResults} crossValidationResults={dummyData.crossValidationResults} />} />
            <Route path="external" element={<ExternalFactorsTab {...dummyData} />} />
          </Routes>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
