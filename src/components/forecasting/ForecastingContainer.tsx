
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ForecastMetricsCards } from "./ForecastMetricsCards";
import { ForecastingHeader } from "./ForecastingHeader";
import { ForecastingTabs } from "./ForecastingTabs";
import { ForecastFilters } from "./ForecastFilters";
import { ScenarioManagement } from "./ScenarioManagement";
import { ModelVersioning } from "./ModelVersioning";
import { DataUploadDialog } from "../settings/DataUploadDialog";
import { Card, CardContent } from "@/components/ui/card";

export function ForecastingContainer() {
  const [activeTab, setActiveTab] = useState("metrics");
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);
  const [isVersioningOpen, setIsVersioningOpen] = useState(false);
  const { toast } = useToast();

  // Model selection state
  const [selectedModel, setSelectedModel] = useState("arima");
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

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedLocation, setSelectedLocation] = useState("");
  
  // Sample data for filter props
  const regions = ["Region 1", "Region 2"];
  const cities = { "Region 1": ["City 1", "City 2"] };
  const channelTypes = ["Channel 1", "Channel 2"];
  const warehouses = ["Warehouse 1", "Warehouse 2"];
  const forecastData = [];

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

  // Sample scenario data
  const scenarioName = "";
  const currentModel = "arima";
  const currentHorizon = "monthly";
  const currentParameters = {};

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

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
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedChannel={selectedChannel}
              setSelectedChannel={setSelectedChannel}
              selectedWarehouse={selectedWarehouse}
              setSelectedWarehouse={setSelectedWarehouse}
              regions={regions}
              cities={cities}
              channelTypes={channelTypes}
              warehouses={warehouses}
              forecastData={forecastData}
            />
          )}
        </CardContent>
      </Card>

      <ScenarioManagement
        scenarioName={scenarioName}
        setScenarioName={() => {}}
        currentModel={currentModel}
        currentHorizon={currentHorizon}
        currentParameters={currentParameters}
        forecastData={forecastData}
        onScenarioLoad={() => {}}
      />

      <ModelVersioning modelId={currentModel} />
      
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
