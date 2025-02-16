
import { useState } from "react";
import { FileUpload } from "../upload/FileUpload";
import { HierarchyTableView } from "../hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { TableRowData } from "../hierarchy/types";

export function ProductHierarchyUpload() {
  const [uploadedData, setUploadedData] = useState<TableRowData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const sanitizeValue = (value: any): any => {
    if (value === null || value === undefined) return '';
    
    if (typeof value === 'string') {
      // Remove null bytes and invalid characters
      return value
        .replace(/\u0000/g, '') // Remove null bytes
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control characters
        .trim();
    }
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(sanitizeValue);
      }
      const sanitizedObj: Record<string, any> = {};
      Object.entries(value).forEach(([key, val]) => {
        sanitizedObj[key] = sanitizeValue(val);
      });
      return sanitizedObj;
    }
    
    return value;
  };

  const handleUploadComplete = async (data: TableRowData[]) => {
    setIsUploading(true);
    try {
      // Sanitize the data before sending to Supabase
      const sanitizedData = data.map(row => {
        const cleanRow: TableRowData = {};
        Object.entries(row).forEach(([key, value]) => {
          cleanRow[key] = sanitizeValue(value);
        });
        return cleanRow;
      });

      console.log('Uploading sanitized data:', sanitizedData);

      const { error } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: 'product',
          data: sanitizedData,
          is_active: true,
          version: 1
        });

      if (error) throw error;

      setUploadedData(sanitizedData);
      toast({
        title: "Success",
        description: "Product hierarchy uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload product hierarchy",
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
          <h3 className="text-xl font-semibold tracking-tight">Product Hierarchy</h3>
          <p className="text-sm text-muted-foreground">
            Upload and manage your product hierarchy data for inventory management
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
            tableName="product_hierarchy"
            columns={columns}
            combinedHeaders={combinedHeaders}
          />
        </div>
      )}
    </div>
  );
}
