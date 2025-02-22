
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { IntegratedDataTable } from "./IntegratedDataTable";
import { SavedIntegratedFiles } from "./SavedIntegratedFiles";
import { useIntegratedData } from "./useIntegratedData";
import { ColumnSelector } from "../product-hierarchy/components/ColumnSelector";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function IntegratedDataPreview() {
  const { data, isLoading, isIntegrating, handleIntegration } = useIntegratedData();
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (data.length > 0) {
      const allColumns = new Set<string>();
      // Add fixed columns
      ['date', 'actual_value', 'sku'].forEach(col => allColumns.add(col));
      // Add metadata columns
      data.forEach(row => {
        if (row.metadata) {
          Object.keys(row.metadata).forEach(key => allColumns.add(key));
        }
      });
      setSelectedColumns(allColumns);
    }
  }, [data]);

  const handleSaveData = async () => {
    if (!user) return;

    try {
      const timestamp = new Date().getTime();
      const filteredData = data.map(row => {
        const newRow: any = {
          date: row.date,
          actual_value: row.actual_value,
          sku: row.sku
        };
        
        if (row.metadata) {
          Object.entries(row.metadata).forEach(([key, value]) => {
            if (selectedColumns.has(key)) {
              newRow[key] = value;
            }
          });
        }
        return newRow;
      });

      const { error } = await supabase
        .from('permanent_hierarchy_files')
        .insert({
          file_name: `integrated_data_${timestamp}`,
          original_name: `integrated_data_${new Date().toISOString().slice(0, 10)}.csv`,
          hierarchy_type: 'integrated_data',
          data: filteredData,
          selected_columns: Array.from(selectedColumns),
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Data saved successfully",
      });
      
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Failed to save data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Integrated Data Preview</h3>
          <Button onClick={handleIntegration} disabled={isIntegrating}>
            {isIntegrating ? "Integrating..." : "Integrate Data"}
          </Button>
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
            />
            
            <Button 
              onClick={handleSaveData}
              disabled={selectedColumns.size === 0}
              className="mb-4"
            >
              Save Selected Columns
            </Button>

            <IntegratedDataTable data={data} selectedColumns={selectedColumns} />
          </div>
        )}

        {isLoading && <p>Loading...</p>}
      </Card>

      <SavedIntegratedFiles triggerRefresh={refreshTrigger} />
    </div>
  );
}
