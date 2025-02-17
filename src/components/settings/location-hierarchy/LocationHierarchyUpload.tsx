
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "../upload/FileUpload";
import { ColumnSelector } from "./components/ColumnSelector";
import { SavedLocationFiles } from "./SavedLocationFiles";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export function LocationHierarchyUpload() {
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
                handleUploadSuccess(data, `location_${new Date().getTime()}`);
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
              <ColumnSelector
                tableName="location_hierarchy"
                combinedHeaders={uploadedData[0] ? Object.keys(uploadedData[0]).map(header => ({
                  header,
                  level: null
                })) : []}
                selectedColumns={selectedColumns}
                onSelectedColumnsChange={setSelectedColumns}
                tempUploadId={tempUploadId}
                data={uploadedData}
                onSaveSuccess={handleSaveSuccess}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <SavedLocationFiles triggerRefresh={refreshTrigger} />
    </div>
  );
}
