
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "../upload/FileUpload";
import { SavedFiles } from "../files/SavedFiles";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export function HistoricalSalesUpload() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = (data: any[]) => {
    setError(null);
    setUploadProgress(100);
    setIsUploading(false);
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Upload Successful",
      description: `${data.length} records have been uploaded successfully`,
    });
  };

  const handleUploadError = (error: string) => {
    setError(error);
    setUploadProgress(0);
    setIsUploading(false);
    toast({
      variant: "destructive",
      title: "Upload Error",
      description: error
    });
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
              onUploadComplete={handleUploadSuccess}
              onError={handleUploadError}
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
          </div>
        </CardContent>
      </Card>

      <SavedFiles triggerRefresh={refreshTrigger} hierarchyType="historical_sales" />
    </div>
  );
}
