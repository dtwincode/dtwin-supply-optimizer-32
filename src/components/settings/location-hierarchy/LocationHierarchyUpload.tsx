import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "../upload/FileUpload";
import { ColumnSelector } from "./components/ColumnSelector";
import { SavedLocationFiles } from "./SavedLocationFiles";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LocationHierarchyUpload() {
  const [uploadedData, setUploadedData] = useState<any[] | null>(null);
  const [tempUploadId, setTempUploadId] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleUploadSuccess = (data: any[], uploadId: string) => {
    setUploadedData(data);
    setTempUploadId(uploadId);
    setError(null);
  };

  const handleUploadError = (error: string) => {
    setError(error);
    setUploadedData(null);
    setTempUploadId(null);
    toast({
      variant: "destructive",
      title: "Upload Error",
      description: error
    });
  };

  const handleSaveSuccess = async () => {
    if (isSaving) return; // Prevent multiple saves

    try {
      setIsSaving(true);
      // Reset upload state
      setUploadedData(null);
      setTempUploadId(null);
      setSelectedColumns(new Set());
      
      // Trigger refresh of saved files
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
              allowedFileTypes={[".csv", ".xlsx"]}
              maxSize={5}
            />

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
