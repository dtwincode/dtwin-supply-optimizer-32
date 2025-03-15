
import { Button } from "@/components/ui/button";
import { IntegratedDataPreviewTable } from "./IntegratedDataPreviewTable";
import { useIntegratedData } from "./useIntegratedData";
import { MappingConfigDialog } from "./MappingConfigDialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertCircle, Info, Database } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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

  // Always initialize state regardless of conditions
  const [showHelp, setShowHelp] = useState(false);
  
  // Update the showHelp state based on conditions
  useEffect(() => {
    setShowHelp(!hasIntegrated);
  }, [hasIntegrated]);

  // Clear the help prompt after successful deletion of a mapping
  useEffect(() => {
    if (!selectedMapping && savedMappings.length === 0) {
      setShowHelp(true);
    }
  }, [selectedMapping, savedMappings]);

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {/* Header section with improved clarity */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Integrated Data Preview</h3>
            <p className="text-sm text-muted-foreground">
              View and manage integrated forecast data
            </p>
          </div>
          <div className="flex items-center gap-4">
            {selectedMapping && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <span className="text-xs font-medium">Active Config:</span>
                  <span className="font-semibold">{selectedMapping.mapping_name}</span>
                </Badge>
              </div>
            )}
            <Button 
              onClick={() => setMappingDialogOpen(true)}
              variant={selectedMapping ? "outline" : "default"}
            >
              {selectedMapping ? "Change Configuration" : "Configure Integration"}
            </Button>
          </div>
        </div>

        <MappingConfigDialog
          open={mappingDialogOpen}
          onOpenChange={setMappingDialogOpen}
          onSave={handleSaveMapping}
          selectedMapping={selectedMapping}
          onDelete={handleDeleteMapping}
          savedMappings={savedMappings}
        />

        {/* User guidance for first-time visitors */}
        {showHelp && (
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">How to integrate your data</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal pl-4">
                  <li>Start by clicking "Configure Integration" to set up a mapping configuration</li>
                  <li>Review available data sources (product hierarchy, location hierarchy, and historical sales)</li>
                  <li>Define mapping relationships between product and location identifiers</li>
                  <li>Select which columns from your historical data to include</li>
                  <li>Save your configuration and activate it</li>
                  <li>Click "Run Integration" to process your data</li>
                </ol>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-700 hover:text-blue-800 hover:bg-blue-100 p-0 h-auto"
                  onClick={() => setShowHelp(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Error handling with better messaging */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Integration Error</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
              <p className="text-sm mt-2">
                This typically happens when the selected mapping doesn't match your data structure. 
                Try reviewing your configuration or check that you've uploaded the required data files.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Status indicator for integration */}
        {isIntegrating && (
          <Alert className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Integration in Progress</AlertTitle>
            <AlertDescription className="text-amber-700">
              Data integration is running. This process may take several minutes depending on the size of your data.
              You can continue using other parts of the application while waiting.
            </AlertDescription>
          </Alert>
        )}

        {/* Table with clearer initial state - Only show when we have a configuration */}
        {!selectedMapping ? (
          <Card className="p-6 text-center border-dashed">
            <Database className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-muted-foreground mb-2">No Active Configuration</h4>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              You need to select or create a mapping configuration before you can integrate and view data.
              This step helps connect your product, location, and sales data together.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setMappingDialogOpen(true)}
              className="mx-auto"
            >
              Get Started with Integration
            </Button>
          </Card>
        ) : !data.length && !isLoading && !isIntegrating ? (
          <Card className="p-6 text-center border-dashed">
            <Database className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-muted-foreground mb-2">No Integrated Data Available</h4>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Data integration needs to be configured and run before any data will appear here.
              Your configuration "{selectedMapping.mapping_name}" is ready but hasn't been run yet.
            </p>
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setMappingDialogOpen(true)}
              >
                View Configuration
              </Button>
              <Button
                variant="default"
                onClick={handleIntegration}
              >
                Run Integration
              </Button>
            </div>
          </Card>
        ) : (
          <IntegratedDataPreviewTable
            data={data}
            isLoading={isLoading}
            validationStatus={validationStatus}
          />
        )}

        {/* Action buttons with clearer states and additional guidance */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {data.length > 0 ? 
              `Displaying ${data.length} integrated records` : 
              selectedMapping ? 
                "No data has been integrated yet. Click 'Run Integration' to process your data." : 
                "Select a configuration before running integration."
            }
          </div>
          <Button 
            variant="default" 
            onClick={handleIntegration} 
            disabled={isIntegrating || !selectedMapping}
            className={isIntegrating ? "bg-blue-400" : ""}
          >
            {isIntegrating ? "Integration Running..." : hasIntegrated ? "Refresh Integration" : "Run Integration"}
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
}
