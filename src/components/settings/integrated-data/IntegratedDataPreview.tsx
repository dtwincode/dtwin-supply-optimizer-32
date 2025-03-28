
import { useState, useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useIntegratedData } from "./useIntegratedData";
import { IntegratedDataPreviewTable } from "./IntegratedDataPreviewTable";
import { MappingConfigDialog } from "./MappingConfigDialog";
import { IntegratedDataHeader } from "./components/IntegratedDataHeader";
import { IntegratedDataHelp } from "./components/IntegratedDataHelp";
import { IntegratedDataError } from "./components/IntegratedDataError";
import { IntegrationStatus } from "./components/IntegrationStatus";
import { NoConfigurationView } from "./components/NoConfigurationView";
import { NoDataView } from "./components/NoDataView";
import { DataAlert } from "./components/DataAlert";
import { IntegrationActions } from "./components/IntegrationActions";

export function IntegratedDataPreview() {
  const { 
    data,
    isLoading,
    isIntegrating,
    mappingDialogOpen,
    setMappingDialogOpen,
    selectedMapping,
    savedMappings,
    validationStatus,
    error,
    hasIntegrated,
    handleIntegration,
    handleSaveMapping,
    handleDeleteMapping
  } = useIntegratedData();

  const [showHelp, setShowHelp] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Update the showHelp state based on conditions
  useEffect(() => {
    setShowHelp(!hasIntegrated && !selectedMapping);
  }, [hasIntegrated, selectedMapping]);

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <IntegratedDataHeader 
          selectedMapping={selectedMapping}
          onConfigureClick={() => setMappingDialogOpen(true)} 
        />

        <MappingConfigDialog
          open={mappingDialogOpen}
          onOpenChange={setMappingDialogOpen}
          onSave={handleSaveMapping}
          selectedMapping={selectedMapping}
          onDelete={handleDeleteMapping}
          savedMappings={savedMappings}
        />

        <IntegratedDataHelp 
          visible={showHelp} 
          onDismiss={() => setShowHelp(false)} 
        />

        <IntegratedDataError error={error} />
        <IntegrationStatus isIntegrating={isIntegrating} />

        {!selectedMapping ? (
          <NoConfigurationView onConfigureClick={() => setMappingDialogOpen(true)} />
        ) : !data.length && !isLoading && !isIntegrating ? (
          <NoDataView 
            selectedMapping={selectedMapping}
            onRunIntegration={handleIntegration}
            onViewConfiguration={() => setMappingDialogOpen(true)}
          />
        ) : (
          <>
            <DataAlert selectedMapping={selectedMapping} />
            
            {/* Debugging button - only visible in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-2">
                <button 
                  onClick={() => setShowDebugInfo(!showDebugInfo)} 
                  className="text-xs text-muted-foreground underline"
                >
                  {showDebugInfo ? 'Hide' : 'Show'} Debug Info
                </button>
                {showDebugInfo && (
                  <div className="mt-2 p-2 bg-slate-50 text-xs border rounded">
                    <p>Data count: {data.length}</p>
                    <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
                    <p>Integrating: {isIntegrating ? 'Yes' : 'No'}</p>
                    <p>Has integrated: {hasIntegrated ? 'Yes' : 'No'}</p>
                    <p>Selected mapping: {selectedMapping ? selectedMapping.mapping_name : 'None'}</p>
                  </div>
                )}
              </div>
            )}
            
            <IntegratedDataPreviewTable
              data={data}
              isLoading={isLoading}
              validationStatus={validationStatus}
              selectedMapping={selectedMapping}
            />
          </>
        )}

        <IntegrationActions 
          data={data}
          selectedMapping={selectedMapping}
          isIntegrating={isIntegrating}
          hasIntegrated={hasIntegrated}
          onRunIntegration={handleIntegration}
        />
      </div>
    </ErrorBoundary>
  );
}
