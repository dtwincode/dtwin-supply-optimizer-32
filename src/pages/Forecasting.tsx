
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
import { useLocalStorage } from "@/hooks/use-local-storage";
import { FiltersContainer } from "@/components/forecasting/filters/FiltersContainer";
import { ForecastDataPoint } from "@/types/forecasting";

const Forecasting = () => {
  // Single state object for all location filters
  const [locationFilters, setLocationFilters] = useLocalStorage('locationFilters', {
    region: 'all',
    city: 'all',
    warehouse: 'all',
    channel: 'all',
  });

  // Product hierarchy states
  const [selectedL1MainProd, setSelectedL1MainProd] = useLocalStorage('selectedL1MainProd', 'all');
  const [selectedL2ProdLine, setSelectedL2ProdLine] = useLocalStorage('selectedL2ProdLine', 'all');
  const [selectedL3ProdCategory, setSelectedL3ProdCategory] = useLocalStorage('selectedL3ProdCategory', 'all');
  const [selectedL4DeviceMake, setSelectedL4DeviceMake] = useLocalStorage('selectedL4DeviceMake', 'all');
  const [selectedL5ProdSubCategory, setSelectedL5ProdSubCategory] = useLocalStorage('selectedL5ProdSubCategory', 'all');
  const [selectedL6DeviceModel, setSelectedL6DeviceModel] = useLocalStorage('selectedL6DeviceModel', 'all');
  const [selectedL7DeviceColor, setSelectedL7DeviceColor] = useLocalStorage('selectedL7DeviceColor', 'all');
  const [selectedL8DeviceStorage, setSelectedL8DeviceStorage] = useLocalStorage('selectedL8DeviceStorage', 'all');

  // Time period states
  const [trainingFromDate, setTrainingFromDate] = useLocalStorage('trainingFromDate', new Date('2024-01-01').toISOString());
  const [trainingToDate, setTrainingToDate] = useLocalStorage('trainingToDate', new Date('2024-09-30').toISOString());
  const [testingFromDate, setTestingFromDate] = useLocalStorage('testingFromDate', new Date('2024-10-01').toISOString());
  const [testingToDate, setTestingToDate] = useLocalStorage('testingToDate', new Date('2024-12-31').toISOString());

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
    }
  };

  const handleLocationFilterChange = (field: string, value: string) => {
    setLocationFilters(prev => ({
      ...prev,
      [field]: value
    }));
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

        <div className="px-6 space

-y-6 mt-6">
          <FiltersContainer
            locationFilters={locationFilters}
            onLocationFilterChange={handleLocationFilterChange}
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
            trainingFromDate={trainingFromDate}
            trainingToDate={trainingToDate}
            testingFromDate={testingFromDate}
            testingToDate={testingToDate}
            setTrainingFromDate={setTrainingFromDate}
            setTrainingToDate={setTrainingToDate}
            setTestingFromDate={setTestingFromDate}
            setTestingToDate={setTestingToDate}
            forecastData={dummyData.filteredData}
          />

          <Routes>
            <Route index element={<ForecastAnalysisTab filteredData={dummyData.filteredData} confidenceIntervals={dummyData.confidenceIntervals} />} />
            <Route path="distribution" element={<ForecastDistributionTab forecastTableData={[]} />} />
            <Route path="descriptive" element={<DescriptiveAnalysisTab filteredData={dummyData.filteredData} />} />
            <Route path="pattern" element={<DecompositionTab filteredData={dummyData.filteredData} decomposition={dummyData.decomposition} />} />
            <Route path="what-if" element={<WhatIfAnalysisTab filteredData={dummyData.filteredData} whatIfScenario={[]} />} />
            <Route path="validation" element={<ValidationTab validationResults={dummyData.validationResults} crossValidationResults={dummyData.crossValidationResults} />} />
            <Route path="external" element={<ExternalFactorsTab />} />
          </Routes>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
