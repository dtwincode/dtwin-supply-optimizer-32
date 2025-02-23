
import { Button } from "@/components/ui/button";
import { IntegratedDataPreviewTable } from "./IntegratedDataPreviewTable";
import { useIntegratedData } from "./useIntegratedData";
import { MappingConfigDialog } from "./MappingConfigDialog";
import { Badge } from "@/components/ui/badge";

export function IntegratedDataPreview() {
  const { 
    data,
    isLoading,
    isIntegrating,
    mappingDialogOpen,
    setMappingDialogOpen,
    selectedMapping,
    setSelectedMapping,
    savedMappings,
    validationStatus,
    error,
    handleIntegration,
    handleSaveMapping,
    handleDeleteMapping
  } = useIntegratedData();

  return (
    <div className="space-y-4">
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
              <Badge variant="secondary">
                Active Config: {selectedMapping.mapping_name}
              </Badge>
            </div>
          )}
          <Button onClick={() => setMappingDialogOpen(true)}>
            Configure Integration
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

      {error && (
        <div className="rounded-md border border-destructive p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <IntegratedDataPreviewTable
        data={data}
        isLoading={isLoading}
        validationStatus={validationStatus}
      />

      <div className="flex justify-end">
        <Button 
          variant="default" 
          onClick={handleIntegration} 
          disabled={isIntegrating || !selectedMapping}
        >
          {isIntegrating ? "Integrating..." : "Run Integration"}
        </Button>
      </div>
    </div>
  );
}
