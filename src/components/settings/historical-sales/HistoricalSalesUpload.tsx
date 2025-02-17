
import { useState } from "react";
import { FileUpload } from "../upload/FileUpload";
import { HierarchyTableView } from "../hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { TableRowData } from "../hierarchy/types";
import { Card } from "@/components/ui/card";

export function HistoricalSalesUpload() {
  const [uploadedData, setUploadedData] = useState<TableRowData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [savedFileName, setSavedFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUploadComplete = (data: TableRowData[]) => {
    const sanitizedData = data.map(row => {
      const cleanRow: TableRowData = {};
      Object.entries(row).forEach(([key, value]) => {
        cleanRow[key] = value === null || value === undefined ? '' : String(value).trim();
      });
      return cleanRow;
    });
    setUploadedData(sanitizedData);
    setSavedFileName(`historical_sales_${new Date().getTime()}`);
  };

  const handlePushToSystem = async () => {
    setIsUploading(true);
    try {
      // First, mark all existing historical sales data as inactive
      await supabase
        .from('permanent_hierarchy_data')
        .update({ is_active: false })
        .eq('hierarchy_type', 'historical_sales');

      // Then insert the new data
      const { error } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: 'historical_sales',
          data: uploadedData,
          is_active: true,
          version: 1
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Historical sales data has been updated successfully",
      });
    } catch (error) {
      console.error('Error pushing historical sales data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update historical sales data"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const columns = uploadedData.length > 0 
    ? Object.keys(uploadedData[0])
    : [];

  const combinedHeaders = columns.map(column => ({
    column,
    sampleData: uploadedData[0]?.[column]?.toString() || ''
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight">Historical Sales Data</h3>
          <p className="text-sm text-muted-foreground">
            Upload and manage your historical sales data for analysis and forecasting
          </p>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload">Data Upload</TabsTrigger>
            <TabsTrigger value="mapping">Hierarchy Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <FileUpload
              onUploadComplete={handleUploadComplete}
              allowedFileTypes={[".csv", ".xlsx"]}
              maxFileSize={5}
            />

            {uploadedData.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="h-7">
                    {uploadedData.length} records
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={handlePushToSystem}
                      disabled={isUploading}
                      className="px-4"
                    >
                      {isUploading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
                <HierarchyTableView 
                  data={uploadedData}
                  tableName="historical_sales"
                  columns={columns}
                  combinedHeaders={combinedHeaders}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Configure how your historical sales data maps to your location and product hierarchies
            </div>
            {/* We'll implement the mapping interface in the next iteration */}
            <div className="p-4 border rounded-md bg-muted">
              <p>Mapping configuration interface will be implemented here</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
