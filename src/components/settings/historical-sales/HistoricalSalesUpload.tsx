
import { useState } from "react";
import { FileUpload } from "../upload/FileUpload";
import { HierarchyTableView } from "../hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { TableRowData } from "../hierarchy/types";

export function HistoricalSalesUpload() {
  const [uploadedData, setUploadedData] = useState<TableRowData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUploadComplete = async (data: TableRowData[]) => {
    setIsUploading(true);
    try {
      const { error } = await supabase
        .from('historical_sales_data')
        .insert({
          data: data,
          is_active: true,
          version: 1
        });

      if (error) throw error;

      setUploadedData(data);
      toast({
        title: "Success",
        description: "Historical sales data uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload historical sales data",
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
          </div>
          <HierarchyTableView 
            data={uploadedData}
            tableName="historical_sales_data"
            columns={columns}
            combinedHeaders={combinedHeaders}
          />
        </div>
      )}
    </div>
  );
}
