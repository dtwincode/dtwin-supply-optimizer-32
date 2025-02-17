
import { useState, useEffect } from "react";
import { FileUpload } from "../upload/FileUpload";
import { HierarchyTableView } from "../hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { TableRowData, ColumnHeader } from "../hierarchy/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SavedLocationFiles } from "./SavedLocationFiles";

export function LocationHierarchyUpload() {
  const [uploadedData, setUploadedData] = useState<TableRowData[]>([]);
  const [tempUploadId, setTempUploadId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleUploadComplete = async (data: TableRowData[], originalFileName: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to update location hierarchy",
      });
      return;
    }

    setUploadedData(data);

    try {
      const tempFileName = `temp_location_hierarchy_${new Date().getTime()}`;
      
      // Save to temporary storage first
      const { data: tempUpload, error: tempError } = await supabase
        .from('temp_hierarchy_uploads')
        .insert({
          filename: tempFileName,
          original_name: originalFileName, // Use the original filename
          hierarchy_type: 'location_hierarchy',
          file_type: originalFileName.split('.').pop()?.toLowerCase() || 'csv',
          storage_path: `/temp/${tempFileName}`,
          processed_by: user.id,
          row_count: data.length,
          headers: Object.keys(data[0]),
          sample_data: data.slice(0, 5),
          status: 'pending'
        })
        .select()
        .single();

      if (tempError) throw tempError;

      // Store the temporary upload ID
      setTempUploadId(tempUpload.id);

      toast({
        title: "Success",
        description: "File uploaded successfully. Select columns to continue.",
      });
    } catch (error) {
      console.error('Error saving temporary data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save temporary data"
      });
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

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
          <Badge variant="secondary" className="h-7">
            {uploadedData.length} records
          </Badge>
          <HierarchyTableView 
            data={uploadedData}
            tableName="location_hierarchy"
            columns={columns}
            combinedHeaders={combinedHeaders}
          />
        </div>
      )}

      <SavedLocationFiles triggerRefresh={refreshTrigger} />
    </div>
  );
}
