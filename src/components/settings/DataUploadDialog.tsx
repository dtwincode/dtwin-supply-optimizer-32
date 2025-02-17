
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { FileUpload } from "./upload/FileUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HierarchyTableView } from "./hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";

export interface DataUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tableName: string;
  module: string;
  onDataUploaded?: () => void;
}

export function DataUploadDialog({
  isOpen,
  onClose,
  title,
  tableName,
  module,
  onDataUploaded
}: DataUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (data: File[], fileName: string) => {
    setFile(new File([JSON.stringify(data)], fileName));
    setValidationErrors([]);
    setProgress(0);
  };

  const handleUploadComplete = (data: any[]) => {
    setUploadedData(data);
    setProgress(100);
    onDataUploaded?.();
    toast({
      title: "Success",
      description: "File uploaded successfully",
    });
  };

  const handleUploadError = (error: string) => {
    setValidationErrors([error]);
    setProgress(0);
    toast({
      variant: "destructive",
      title: "Error",
      description: error,
    });
  };

  const handleClose = () => {
    setFile(null);
    setProgress(0);
    setValidationErrors([]);
    setUploadedData([]);
    onClose();
  };

  const columns = uploadedData.length > 0 
    ? Object.keys(uploadedData[0])
    : [];

  const combinedHeaders = columns.map(column => ({
    column,
    sampleData: uploadedData[0]?.[column]?.toString() || ''
  }));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              {validationErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            allowedFileTypes={[".csv", ".xlsx"]}
            maxSize={5}
          />

          {progress > 0 && (
            <Progress value={progress} className="w-full" />
          )}

          {uploadedData.length > 0 && (
            <HierarchyTableView
              data={uploadedData}
              tableName={tableName}
              columns={columns}
              combinedHeaders={combinedHeaders}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
