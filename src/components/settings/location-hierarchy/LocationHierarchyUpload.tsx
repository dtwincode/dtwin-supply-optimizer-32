import { useState, useEffect } from "react";
import { FileUpload } from "../upload/FileUpload";
import { HierarchyTableView } from "../hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Download, FileBox, Trash2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TableRowData, ColumnHeader } from "../hierarchy/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import * as XLSX from 'xlsx';

export function LocationHierarchyUpload() {
  const [uploadedData, setUploadedData] = useState<TableRowData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [savedFileName, setSavedFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Query for the latest saved hierarchy
  const { data: latestSavedHierarchy } = useQuery({
    queryKey: ['latestHierarchyData', 'location'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('*')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  // Query for all saved hierarchies
  const { data: savedHierarchies } = useQuery({
    queryKey: ['locationHierarchies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('*')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleUploadComplete = (data: TableRowData[]) => {
    setUploadedData(data);
    setSavedFileName(`location_hierarchy_${new Date().getTime()}`);
  };

  const handleDownloadHierarchy = (hierarchy: any) => {
    if (!hierarchy.data || !Array.isArray(hierarchy.data)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid hierarchy data for download",
      });
      return;
    }

    try {
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(hierarchy.data);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Location Hierarchy");

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `location_hierarchy_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Hierarchy file downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download hierarchy file",
      });
    }
  };

  const handleDeleteHierarchy = async (hierarchyId: string) => {
    try {
      const { error } = await supabase
        .from('permanent_hierarchy_data')
        .delete()
        .eq('id', hierarchyId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['locationHierarchies'] });
      queryClient.invalidateQueries({ queryKey: ['latestHierarchyData', 'location'] });

      toast({
        title: "Success",
        description: "Hierarchy deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete hierarchy",
      });
    }
  };

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

      {/* Latest Saved File Section */}
      <Card className="p-8 border-[#82ca9d] border-2 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <FileBox className="h-7 w-7 text-[#16a34a]" />
          <h3 className="text-2xl font-semibold">Latest Saved File</h3>
        </div>
        {latestSavedHierarchy ? (
          <div className="space-y-2">
            <p className="font-medium text-lg">Location Hierarchy</p>
            <p className="text-base text-muted-foreground">
              Saved on {new Date(latestSavedHierarchy.created_at).toLocaleDateString()}
            </p>
            <Button
              variant="outline"
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => handleDownloadHierarchy(latestSavedHierarchy)}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        ) : (
          <p className="text-xl text-[#64748b]">No files have been saved yet.</p>
        )}
      </Card>

      {/* All Saved Files Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">All Saved Hierarchies</h3>
        <div className="space-y-2">
          {savedHierarchies && savedHierarchies.length > 0 ? (
            savedHierarchies.map((hierarchy) => (
              <div
                key={hierarchy.id}
                className="flex items-center justify-between p-3 rounded-md border hover:bg-accent"
              >
                <div className="flex-1">
                  <p className="font-medium">Location Hierarchy</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(hierarchy.created_at).toLocaleDateString()}
                    {hierarchy.is_active && <span className="ml-2 text-green-600">(Active)</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDownloadHierarchy(hierarchy)}
                    className="text-blue-600 hover:text-blue-600 hover:bg-blue-50"
                    title="Download hierarchy"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDeleteHierarchy(hierarchy.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No saved hierarchies yet. Upload and save a file to see it here.
            </p>
          )}
        </div>
      </Card>

      {uploadedData.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="h-7">
              {uploadedData.length} records
            </Badge>
          </div>
          <HierarchyTableView 
            data={uploadedData}
            tableName="location_hierarchy"
            columns={Object.keys(uploadedData[0] || {})}
            combinedHeaders={Object.keys(uploadedData[0] || {}).map(key => ({
              column: key,
              sampleData: uploadedData[0]?.[key]?.toString() || ''
            }))}
          />
        </div>
      )}
    </div>
  );
}
