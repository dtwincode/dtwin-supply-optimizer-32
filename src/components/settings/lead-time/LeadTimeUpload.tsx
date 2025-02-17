import { useState } from "react";
import { FileUpload } from "../upload/FileUpload";
import { HierarchyTableView } from "../hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TableRowData } from "../hierarchy/types";

export function LeadTimeUpload() {
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
    setSavedFileName(`lead_time_${new Date().getTime()}`);
  };

  const handlePushToSystem = async () => {
    setIsUploading(true);
    try {
      await supabase
        .from('permanent_hierarchy_data')
        .update({ is_active: false })
        .eq('hierarchy_type', 'lead_time');

      const { error } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: 'lead_time',
          data: uploadedData,
          is_active: true,
          version: 1
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead time data has been updated successfully",
      });
    } catch (error) {
      console.error('Error pushing lead time data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lead time data"
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
          <h3 className="text-xl font-semibold tracking-tight">Lead Time Data</h3>
          <p className="text-sm text-muted-foreground">
            Configure and manage lead time calculations and predictions for your supply chain
          </p>
        </div>
      </div>

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
            tableName="lead_time"
            columns={columns}
            combinedHeaders={combinedHeaders}
          />
        </div>
      )}
    </div>
  );
}
