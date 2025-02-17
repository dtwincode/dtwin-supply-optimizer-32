
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ForecastMetricsCards } from "./ForecastMetricsCards";
import { ForecastingTabs } from "./ForecastingTabs";
import { ScenarioManagement } from "./ScenarioManagement";
import { ModelVersioning } from "./ModelVersioning";
import { DataUploadDialog } from "../settings/DataUploadDialog";
import { type ModelMetrics } from "@/utils/forecasting/metricsCalculation";

export function ForecastingContainer() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Sample metrics for ForecastMetricsCards
  const metrics: ModelMetrics = {
    mape: 5.2,
    mae: 2.3,
    rmse: 3.1
  };

  // Sample scenario data
  const [scenarioName, setScenarioName] = useState("");
  const currentModel = "arima";
  const currentHorizon = "monthly";
  const currentParameters = {};
  const forecastData = [];

  const handleDataUploaded = () => {
    setIsUploadDialogOpen(false);
  };

  return (
    <div>
      <ForecastMetricsCards metrics={metrics} />
      
      <ForecastingTabs 
        activeTab="forecast"
        historicalData={[]}
        filteredData={[]}
        confidenceIntervals={[]}
        decomposition={{
          trend: [],
          seasonal: []
        }}
        validationResults={{
          biasTest: true,
          residualNormality: true,
          heteroskedasticityTest: true
        }}
        crossValidationResults={{
          trainMetrics: { mape: 0, mae: 0, rmse: 0 },
          testMetrics: { mape: 0, mae: 0, rmse: 0 },
          validationMetrics: { mape: 0, mae: 0, rmse: 0 }
        }}
      />

      <ScenarioManagement
        scenarioName={scenarioName}
        setScenarioName={setScenarioName}
        currentModel={currentModel}
        currentHorizon={currentHorizon}
        currentParameters={currentParameters}
        forecastData={forecastData}
        onScenarioLoad={() => {}}
      />

      <ModelVersioning
        modelId={currentModel}
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
