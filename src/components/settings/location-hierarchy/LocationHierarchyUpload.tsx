
import { useState, useEffect } from "react";
import { FileUpload } from "../upload/FileUpload";
import { HierarchyTableView } from "../hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { TableRowData, ColumnHeader } from "../hierarchy/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SavedLocationFiles } from "./SavedLocationFiles";

export function LocationHierarchyUpload() {
  const [uploadedData, setUploadedData] = useState<TableRowData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [savedFileName, setSavedFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleUploadComplete = (data: TableRowData[]) => {
    setUploadedData(data);
    setSavedFileName(`location_hierarchy_${new Date().getTime()}`);
  };

  const handlePushToFilters = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to update location hierarchy",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Get the latest version number
      const { data: versionData, error: versionError } = await supabase
        .from('permanent_hierarchy_data')
        .select('version')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('version', { ascending: false })
        .limit(1);

      if (versionError) throw versionError;

      const nextVersion = versionData && versionData.length > 0 ? versionData[0].version + 1 : 1;

      // First, mark all existing location hierarchies as inactive
      const { error: updateError } = await supabase
        .from('permanent_hierarchy_data')
        .update({ is_active: false })
        .eq('hierarchy_type', 'location_hierarchy');

      if (updateError) throw updateError;

      // Then insert the new data
      const { error: hierarchyError } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: 'location_hierarchy',
          data: uploadedData,
          is_active: true,
          version: nextVersion,
          created_by: user.id
        });

      if (hierarchyError) throw hierarchyError;

      // Save file reference
      const { error: fileError } = await supabase
        .from('location_hierarchy_files')
        .insert({
          file_name: savedFileName,
          original_name: `Location Hierarchy ${new Date().toLocaleDateString()}`,
          created_by: user.id,
          file_type: 'json',
          file_size: JSON.stringify(uploadedData).length,
          metadata: { records: uploadedData.length }
        });

      if (fileError) throw fileError;

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

  if (isLoading) {
    return <div>Loading...</div>;
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
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="h-7">
              {uploadedData.length} records
            </Badge>
            <div className="flex gap-2">
              <Button
                onClick={handlePushToFilters}
                disabled={isUploading}
                className="h-8 px-3 hover:bg-primary/10"
                title="Save location hierarchy"
              >
                {isUploading ? (
                  <Save className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 text-primary" />
                )}
                <span className="ml-2">Save Hierarchy</span>
              </Button>
            </div>
          </div>
          <HierarchyTableView 
            data={uploadedData}
            tableName="location_hierarchy"
            columns={columns}
            combinedHeaders={combinedHeaders}
          />
        </div>
      )}

      <SavedLocationFiles />
    </div>
  );
}
