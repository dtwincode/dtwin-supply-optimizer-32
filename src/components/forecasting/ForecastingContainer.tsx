
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

  // Sample metrics data
  const metrics = {
    mape: 5.2,
    mae: 2.3,
    rmse: 3.1
  };

  // Sample filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedLocation, setSelectedLocation] = useState("");
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleOpenScenario = () => {
    setIsScenarioOpen(true);
  };

  const handleCloseScenario = () => {
    setIsScenarioOpen(false);
  };

  const handleOpenVersioning = () => {
    setIsVersioningOpen(true);
  };

  const handleCloseVersioning = () => {
    setIsVersioningOpen(false);
  };

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleDataUploaded = () => {
    setIsUploadDialogOpen(false);
  };

  // Sample scenario data
  const scenarioName = "";
  const currentModel = "arima";
  const currentHorizon = "monthly";
  const currentParameters = {};
  const forecastData: any[] = [];

  return (
    <div>
      <ForecastingHeader />

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
              selectedChannel={selectedChannel}
              setSelectedChannel={setSelectedChannel}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              dateRange={dateRange}
              setDateRange={setDateRange}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
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
