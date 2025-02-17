
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { FileUpload } from "./upload/FileUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HierarchyTableView } from "./hierarchy/HierarchyTableView";
import { useToast } from "@/hooks/use-toast";
import { ColumnSelector } from "./location-hierarchy/components/ColumnSelector";

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
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [tempUploadId, setTempUploadId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (data: any[], fileName: string) => {
    setUploadedData(data);
    setTempUploadId(`${module}_${new Date().getTime()}`);
    setProgress(100);
    setValidationErrors([]);
    toast({
      title: "Success",
      description: "File uploaded successfully",
    });
  };

  const handleSaveSuccess = () => {
    onDataUploaded?.();
    toast({
      title: "Success",
      description: "Data saved permanently",
    });
    handleClose();
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
    setSelectedColumns(new Set());
    setTempUploadId(null);
    onClose();
  };

  const columns = uploadedData.length > 0 
    ? Object.keys(uploadedData[0])
    : [];

  const combinedHeaders = columns.map(header => ({
    header,
    level: null
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
            onUploadComplete={handleFileUpload}
            allowedFileTypes={[".csv", ".xlsx"]}
            maxSize={5}
          />

          {progress > 0 && (
            <Progress value={progress} className="w-full" />
          )}

          {uploadedData.length > 0 && tempUploadId && (
            <>
              <HierarchyTableView
                data={uploadedData}
                tableName={tableName}
                columns={columns}
                combinedHeaders={combinedHeaders.map(h => ({
                  column: h.header,
                  sampleData: uploadedData[0]?.[h.header]?.toString() || ''
                }))}
              />
              
              <ColumnSelector
                tableName={tableName}
                combinedHeaders={combinedHeaders}
                selectedColumns={selectedColumns}
                onSelectedColumnsChange={setSelectedColumns}
                tempUploadId={tempUploadId}
                data={uploadedData}
                onSaveSuccess={handleSaveSuccess}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
