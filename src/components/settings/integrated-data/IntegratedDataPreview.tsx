
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { IntegratedDataTable } from "./IntegratedDataTable";
import { SavedIntegratedFiles } from "./SavedIntegratedFiles";
import { useIntegratedData } from "./useIntegratedData";
import { ColumnSelector } from "../product-hierarchy/components/ColumnSelector";
import { MappingConfigDialog } from "./MappingConfigDialog";
import { ForecastMappingConfig } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

export function IntegratedDataPreview() {
  const { 
    data, 
    isLoading, 
    isIntegrating, 
    mappingDialogOpen,
    setMappingDialogOpen,
    handleIntegration,
    handleSaveMapping,
    selectedMapping,
    validationStatus,
    error
  } = useIntegratedData();
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [savedMappings, setSavedMappings] = useState<ForecastMappingConfig[]>([]);
  const [selectedMappingId, setSelectedMappingId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const { data: mappings, error } = await supabase
          .from('forecast_integration_mappings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSavedMappings(mappings as ForecastMappingConfig[]);
      } catch (error) {
        console.error('Error fetching mappings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch mapping configurations",
          variant: "destructive",
        });
      }
    };

    fetchMappings();
  }, [mappingDialogOpen]);

  useEffect(() => {
    if (data.length > 0) {
      const allColumns = new Set<string>();
      
      data.forEach(row => {
        Object.keys(row).forEach(key => {
          if (key !== 'metadata' && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
            allColumns.add(key);
          }
        });
        
        if (row.metadata) {
          Object.keys(row.metadata).forEach(key => allColumns.add(key));
        }
      });
      
      setSelectedColumns(allColumns);
    }
  }, [data]);

  const handleMappingSelect = (mappingId: string) => {
    setSelectedMappingId(mappingId);
  };

  const getMappingDescription = (mapping: ForecastMappingConfig) => {
    const types = [];
    if (mapping.use_product_mapping) types.push('Product');
    if (mapping.use_location_mapping) types.push('Location');
    return `${types.join(' & ')} based mapping`;
  };

  return (
    <div className="space-y-6">
      {/* Configuration Section */}
      <Card className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Data Integration Configuration</h3>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedMappingId} onValueChange={handleMappingSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a mapping configuration" />
                </SelectTrigger>
                <SelectContent>
                  {savedMappings.map((mapping) => (
                    <SelectItem key={mapping.id} value={mapping.id}>
                      {mapping.mapping_name} ({getMappingDescription(mapping)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setMappingDialogOpen(true)} variant="outline">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Mapping
            </Button>
            <Button 
              onClick={handleIntegration} 
              disabled={isIntegrating || !selectedMappingId}
            >
              {isIntegrating ? "Running Integration..." : "Run Integration"}
            </Button>
          </div>

          {selectedMappingId && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Selected Mapping Configuration</h4>
              <p className="text-sm text-muted-foreground">
                {savedMappings.find(m => m.id === selectedMappingId)?.description}
              </p>
            </div>
          )}

          {validationStatus && (
            <Alert variant={validationStatus === 'valid' ? 'default' : 'destructive'}>
              <AlertDescription>
                {validationStatus === 'valid' 
                  ? 'Data integration is valid and complete' 
                  : 'Data integration needs review. Some mappings might be incomplete.'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Preview Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Integrated Data Preview</h3>
        </div>
        
        {data.length > 0 && (
          <div className="space-y-6">
            <ColumnSelector
              tableName="integrated_data"
              combinedHeaders={Array.from(selectedColumns).map(header => ({
                header,
                level: null
              }))}
              selectedColumns={selectedColumns}
              onSelectedColumnsChange={setSelectedColumns}
              tempUploadId={null}
              hierarchyType="integrated_data"
              data={data}
            />
            <IntegratedDataTable data={data} selectedColumns={selectedColumns} />
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading integrated data...</p>
          </div>
        )}

        {!isLoading && data.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No integrated data available. Select a mapping configuration and run the integration to see results.</p>
          </div>
        )}
      </Card>

      <SavedIntegratedFiles triggerRefresh={refreshTrigger} />

      <MappingConfigDialog
        open={mappingDialogOpen}
        onOpenChange={setMappingDialogOpen}
        onSave={handleSaveMapping}
      />
    </div>
  );
}
