
import { useState } from "react";
import { FileUpload } from "../upload/FileUpload";
import { HierarchyTableView } from "../hierarchy/HierarchyTableView";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Upload, FileCheck2, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { TableRowData, ColumnHeader } from "../hierarchy/types";

export function LocationHierarchyUpload() {
  const [uploadedData, setUploadedData] = useState<TableRowData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUploadComplete = (data: TableRowData[]) => {
    setUploadedData(data);
  };

  const handlePushToFilters = async () => {
    setIsUploading(true);
    try {
      // First, mark all existing location hierarchies as inactive
      await supabase
        .from('permanent_hierarchy_data')
        .update({ is_active: false })
        .eq('hierarchy_type', 'location_hierarchy');

      // Then insert the new data
      const { error } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: 'location_hierarchy',
          data: uploadedData,
          is_active: true,
          version: 1, // Adding required version field
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Invalidate the locations query to refresh the filters
      queryClient.invalidateQueries({ queryKey: ['locations'] });

      toast({
        title: "Success",
        description: "Location hierarchy has been updated successfully",
      });
    } catch (error) {
      console.error('Error pushing location hierarchy:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update location hierarchy"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Get column headers from the first row of data
  const columns = uploadedData.length > 0 
    ? Object.keys(uploadedData[0])
    : [];

  // Create combined headers with sample data
  const combinedHeaders: ColumnHeader[] = columns.map(column => ({
    column,
    sampleData: uploadedData[0]?.[column]?.toString() || ''
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight">Location Hierarchy</h3>
          <p className="text-sm text-muted-foreground">
            Upload and manage your location hierarchy data
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
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePushToFilters}
              disabled={isUploading}
              className="h-8 w-8 hover:bg-primary/10"
              title="Push to location filters"
            >
              {isUploading ? (
                <Upload className="h-4 w-4 animate-spin" />
              ) : (
                <Filter className="h-4 w-4 text-primary" />
              )}
            </Button>
          </div>
          <HierarchyTableView 
            data={uploadedData}
            tableName="location_hierarchy"
            columns={columns}
            combinedHeaders={combinedHeaders}
          />
        </div>
      )}
    </div>
  );
}
