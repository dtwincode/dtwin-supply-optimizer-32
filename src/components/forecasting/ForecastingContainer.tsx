import { useState } from "react";
import { ForecastFilters } from "./ForecastFilters";
import { ForecastDataPoint } from "@/types/forecasting";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { ForecastMetricsCards } from "./ForecastMetricsCards";
import { ForecastingHeader } from "./ForecastingHeader";
import { ForecastingTabs } from "./ForecastingTabs";
import { ScenarioManagement } from "./ScenarioManagement";
import { ModelVersioning } from "./ModelVersioning";
import { DataUploadDialog } from "../settings/DataUploadDialog";
import { Card, CardContent } from "@/components/ui/card";

export function ForecastingContainer() {
  const [activeTab, setActiveTab] = useState("metrics");
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);
  const [isVersioningOpen, setIsVersioningOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const { toast } = useToast();

  // Model selection state
  const [selectedModel, setSelectedModel] = useState("arima");

  // Filter states
  const [searchQuery, setSearchQuery] = useLocalStorage('searchQuery', '');
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedChannel, setSelectedChannel] = useLocalStorage('selectedChannel', 'all');
  const [selectedWarehouse, setSelectedWarehouse] = useLocalStorage('selectedWarehouse', 'all');
  
  // Product hierarchy states
  const [selectedL1MainProd, setSelectedL1MainProd] = useLocalStorage('selectedL1MainProd', 'all');
  const [selectedL2ProdLine, setSelectedL2ProdLine] = useLocalStorage('selectedL2ProdLine', 'all');
  const [selectedL3ProdCategory, setSelectedL3ProdCategory] = useLocalStorage('selectedL3ProdCategory', 'all');
  const [selectedL4DeviceMake, setSelectedL4DeviceMake] = useLocalStorage('selectedL4DeviceMake', 'all');
  const [selectedL5ProdSubCategory, setSelectedL5ProdSubCategory] = useLocalStorage('selectedL5ProdSubCategory', 'all');
  const [selectedL6DeviceModel, setSelectedL6DeviceModel] = useLocalStorage('selectedL6DeviceModel', 'all');
  const [selectedL7DeviceColor, setSelectedL7DeviceColor] = useLocalStorage('selectedL7DeviceColor', 'all');
  const [selectedL8DeviceStorage, setSelectedL8DeviceStorage] = useLocalStorage('selectedL8DeviceStorage', 'all');
  
  // Sample data for filter props
  const channelTypes = ["Channel 1", "Channel 2"];
  const warehouses = ["Warehouse 1", "Warehouse 2"];
  const forecastData = [];

  const modelConfigs = [
    { id: "arima", name: "ARIMA" },
    { id: "prophet", name: "Prophet" },
    { id: "lstm", name: "LSTM" }
  ];

  // Sample metrics data
  const metrics = {
    mape: 5.2,
    mae: 2.3,
    rmse: 3.1
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const findBestModel = () => {
    console.log("Finding best model...");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDataUploaded = () => {
    setIsUploadDialogOpen(false);
  };

  const handleScenarioLoad = (scenario: any) => {
    console.log("Loading scenario:", scenario);
  };

  const dummyData: ForecastDataPoint[] = [{
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
  }];

  return (
    <div>
      <ForecastingHeader
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        handleExport={handleExport}
        findBestModel={findBestModel}
        modelConfigs={modelConfigs}
      />

      <Card className="mt-6">
        <CardContent className="p-6">
          <ForecastingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "metrics" && <ForecastMetricsCards metrics={metrics} />}
          {activeTab === "filters" && (
            <ForecastFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedChannel={selectedChannel}
              setSelectedChannel={setSelectedChannel}
              selectedWarehouse={selectedWarehouse}
              setSelectedWarehouse={setSelectedWarehouse}
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
              channelTypes={channelTypes}
              warehouses={warehouses}
              forecastData={forecastData}
            />
          )}
        </CardContent>
      </Card>

      <ScenarioManagement
        scenarioName={scenarioName}
        setScenarioName={setScenarioName}
        currentModel={selectedModel}
        currentHorizon="1-month"
        currentParameters={{}}
        forecastData={forecastData}
        onScenarioLoad={handleScenarioLoad}
      />

      <ModelVersioning
        modelId={selectedModel}
      />
      
      <DataUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        title="Upload Forecasting Data"
        tableName="forecasting_data"
        module="forecasting"
        onDataUploaded={handleDataUploaded}
      />
    </div>
  );
}
