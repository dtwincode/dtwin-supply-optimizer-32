
import { useState, useEffect } from "react";
import { FileUpload } from "../upload/FileUpload";
import { HierarchyTableView } from "../hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TableRowData } from "../hierarchy/types";
import { ColumnSelector } from "../location-hierarchy/components/ColumnSelector";
import { FileList } from "../location-hierarchy/components/FileList";
import { Card } from "@/components/ui/card";

export function HistoricalSalesUpload() {
  const [uploadedData, setUploadedData] = useState<TableRowData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [savedFiles, setSavedFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempUploadId] = useState<string>(`historical_sales_${new Date().getTime()}`);
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchSavedFiles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'historical_sales')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Failed to fetch saved files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedFiles();
  }, []);

  const handleUploadComplete = (data: TableRowData[]) => {
    const sanitizedData = data.map(row => {
      const cleanRow: TableRowData = {};
      Object.entries(row).forEach(([key, value]) => {
        cleanRow[key] = value === null || value === undefined ? '' : String(value).trim();
      });
      return cleanRow;
    });
    setUploadedData(sanitizedData);
    // Initialize selected columns with all columns
    if (sanitizedData.length > 0) {
      setSelectedColumns(new Set(Object.keys(sanitizedData[0])));
    }
  };

  const handleSelectedColumnsChange = (columns: Set<string>) => {
    setSelectedColumns(columns);
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('permanent_hierarchy_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      fetchSavedFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file"
      });
    }
  };

  const handleDownloadFile = async (file: any) => {
    try {
      const fileData = file.data;
      const csvContent = convertToCSV(fileData);
      downloadCSV(csvContent, file.original_name);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file"
      });
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = uploadedData.length > 0 
    ? Object.keys(uploadedData[0])
    : [];

  const combinedHeaders = columns.map(column => ({
    header: column,
    level: null
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold tracking-tight">Historical Sales Data</h3>
          <p className="text-sm text-muted-foreground">
            Upload and manage your historical sales data
          </p>
        </div>
      </div>

      <FileUpload
        onUploadComplete={handleUploadComplete}
        allowedFileTypes={[".csv", ".xlsx"]}
        maxSize={5}
      />

      {uploadedData.length > 0 && (
        <Card className="p-6">
          <ColumnSelector
            tableName="historical_sales"
            combinedHeaders={combinedHeaders}
            tempUploadId={tempUploadId}
            data={uploadedData}
            selectedColumns={selectedColumns}
            onSelectedColumnsChange={handleSelectedColumnsChange}
            onSaveSuccess={() => {
              setUploadedData([]);
              setSelectedColumns(new Set());
              fetchSavedFiles();
            }}
          />
        </Card>
      )}

      <FileList
        files={savedFiles}
        error={error}
        isLoading={isLoading}
        onDelete={handleDeleteFile}
        onDownload={handleDownloadFile}
      />
    </div>
  );
}
