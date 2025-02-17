import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "../upload/FileUpload";
import { ColumnSelector } from "../location-hierarchy/components/ColumnSelector";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { HierarchyTable } from "../hierarchy/components/HierarchyTable";
import { SavedLocationFiles } from "../location-hierarchy/SavedLocationFiles";

export function LeadTimeUpload() {
  const [uploadedData, setUploadedData] = useState<any[] | null>(null);
  const [tempUploadId, setTempUploadId] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = (data: any[], uploadId: string) => {
    setUploadedData(data);
    setTempUploadId(uploadId);
    if (data[0]) {
      setSelectedColumns(new Set(Object.keys(data[0])));
    }
    setError(null);
    setUploadProgress(100);
    setIsUploading(false);
    toast({
      title: "Upload Successful",
      description: `${data.length} records have been uploaded successfully`,
    });
  };

  const handleUploadError = (error: string) => {
    setError(error);
    setUploadedData(null);
    setTempUploadId(null);
    setUploadProgress(0);
    setIsUploading(false);
    toast({
      variant: "destructive",
      title: "Upload Error",
      description: error
    });
  };

  const handleSaveSuccess = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      setUploadedData(null);
      setTempUploadId(null);
      setSelectedColumns(new Set());
      setRefreshTrigger(prev => prev + 1);
      
      toast({
        title: "Success",
        description: "File saved and processed successfully"
      });
    } catch (error) {
      console.error('Error in save process:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete save process"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
    setIsUploading(true);
  };

  const handleColumnSelect = (columns: Set<string>) => {
    setSelectedColumns(columns);
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <FileUpload
              onUploadComplete={(data, fileName) => {
                handleUploadSuccess(data, `lead_time_${new Date().getTime()}`);
              }}
              onProgress={handleUploadProgress}
              allowedFileTypes={[".csv", ".xlsx"]}
              maxSize={5}
            />

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {uploadedData && tempUploadId && (
              <>
                <ColumnSelector
                  tableName="lead_time"
                  combinedHeaders={uploadedData[0] ? Object.keys(uploadedData[0]).map(header => ({
                    header,
                    level: null
                  })) : []}
                  selectedColumns={selectedColumns}
                  onSelectedColumnsChange={handleColumnSelect}
                  tempUploadId={tempUploadId}
                  data={uploadedData}
                  onSaveSuccess={handleSaveSuccess}
                  hierarchyType="lead_time"
                />

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Data Preview</h3>
                  <HierarchyTable
                    data={uploadedData}
                    columns={Array.from(selectedColumns)}
                    combinedHeaders={Array.from(selectedColumns).map(header => ({
                      column: header,
                      sampleData: uploadedData[0]?.[header]?.toString() || ''
                    }))}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <SavedLocationFiles triggerRefresh={refreshTrigger} />
    </div>
  );
}
