
import { useState } from "react";
import { ForecastFilters } from "./ForecastFilters";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { ForecastMetricsCards } from "./ForecastMetricsCards";
import { ForecastingHeader } from "./ForecastingHeader";
import { ScenarioManagement } from "./ScenarioManagement";
import { ModelVersioning } from "./ModelVersioning";
import { DataUploadDialog } from "../settings/DataUploadDialog";
import { Card, CardContent } from "@/components/ui/card";
import { ModelParameter } from "@/types/modelParameters";

export function ForecastingContainer() {
  const [activeTab, setActiveTab] = useState("metrics");
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);
  const [isVersioningOpen, setIsVersioningOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const { toast } = useToast();

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    console.log("Date range changed:", startDate, endDate);
  };

  const handleModelChange = (modelId: string) => {
    console.log("Model changed:", modelId);
  };

  const handleFiltersChange = (filters: any) => {
    console.log("Filters changed:", filters);
  };

  const handleParametersChange = (modelId: string, parameters: ModelParameter[]) => {
    console.log("Parameters changed:", modelId, parameters);
  };

  const handleDataUploaded = () => {
    setIsUploadDialogOpen(false);
    toast({
      title: "Data uploaded successfully",
      description: "Your forecasting data has been processed",
    });
  };

  const handleScenarioLoad = (scenario: any) => {
    console.log("Loading scenario:", scenario);
    toast({
      title: "Scenario loaded",
      description: `Loaded scenario: ${scenario.name || 'Unnamed'}`,
    });
  };

  return (
    <div>
      <ForecastingHeader
        onDateRangeChange={handleDateRangeChange}
        onModelChange={handleModelChange}
        onFiltersChange={handleFiltersChange}
        onParametersChange={handleParametersChange}
      />

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="space-y-6">
            {activeTab === "metrics" && (
              <ForecastMetricsCards
                metrics={{
                  mape: 5.2,
                  mae: 2.3,
                  rmse: 3.1
                }}
              />
            )}
            {activeTab === "filters" && (
              <ForecastFilters
                searchQuery=""
                setSearchQuery={() => {}}
                selectedRegion="all"
                setSelectedRegion={() => {}}
                selectedCity="all"
                setSelectedCity={() => {}}
                selectedChannel="all"
                setSelectedChannel={() => {}}
                selectedWarehouse="all"
                setSelectedWarehouse={() => {}}
                selectedL1MainProd="all"
                setSelectedL1MainProd={() => {}}
                selectedL2ProdLine="all"
                setSelectedL2ProdLine={() => {}}
                selectedL3ProdCategory="all"
                setSelectedL3ProdCategory={() => {}}
                selectedL4DeviceMake="all"
                setSelectedL4DeviceMake={() => {}}
                selectedL5ProdSubCategory="all"
                setSelectedL5ProdSubCategory={() => {}}
                selectedL6DeviceModel="all"
                setSelectedL6DeviceModel={() => {}}
                selectedL7DeviceColor="all"
                setSelectedL7DeviceColor={() => {}}
                selectedL8DeviceStorage="all"
                setSelectedL8DeviceStorage={() => {}}
                channelTypes={[]}
                warehouses={[]}
                forecastData={[]}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <ScenarioManagement
        scenarioName={scenarioName}
        setScenarioName={setScenarioName}
        currentModel="arima"
        currentHorizon="1-month"
        currentParameters={{}}
        forecastData={[]}
      />

      <ModelVersioning modelId="arima" />
      
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
