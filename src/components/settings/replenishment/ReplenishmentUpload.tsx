
import { useState } from "react";
import { FileUpload } from "../upload/FileUpload";
import { HierarchyTableView } from "../hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { TableRowData } from "../hierarchy/types";

export function ReplenishmentUpload() {
  const [uploadedData, setUploadedData] = useState<TableRowData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUploadComplete = async (data: TableRowData[]) => {
    setIsUploading(true);
    try {
      const { error } = await supabase
        .from('replenishment_data')
        .insert({
          data: data,
          is_active: true,
          version: 1
        });

      if (error) throw error;

      setUploadedData(data);
      toast({
        title: "Success",
        description: "Replenishment data uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload replenishment data",
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
          <h3 className="text-xl font-semibold tracking-tight">Replenishment Data</h3>
          <p className="text-sm text-muted-foreground">
            Manage replenishment time calculations and configure automated reordering parameters
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
            tableName="replenishment_data"
            columns={columns}
            combinedHeaders={combinedHeaders}
          />
        </div>
      )}
    </div>
  );
}
