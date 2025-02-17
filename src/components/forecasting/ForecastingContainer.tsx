
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

  const handleOpenUploadDialog = () => setIsUploadDialogOpen(true);
  const handleCloseUploadDialog = () => setIsUploadDialogOpen(false);

  const handleDataUploaded = () => {
    // Refresh data or perform other actions
    handleCloseUploadDialog();
  };

  return (
    <div>
      <ForecastingHeader onOpenUpload={handleOpenUploadDialog} />

      <Card className="mt-6">
        <CardContent className="p-6">
          <ForecastingTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {activeTab === "metrics" && <ForecastMetricsCards />}
          {activeTab === "filters" && <ForecastFilters />}
        </CardContent>
      </Card>

      <ScenarioManagement
        isOpen={isScenarioOpen}
        onClose={handleCloseScenario}
      />

      <ModelVersioning
        isOpen={isVersioningOpen}
        onClose={handleCloseVersioning}
      />
      
      <DataUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={handleCloseUploadDialog}
        title="Upload Forecasting Data"
        tableName="forecasting_data"
        module="forecasting"
        onUploadComplete={handleDataUploaded}
      />
    </div>
  );
}

