import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "./upload/FileUpload";

export function DataUploadDialog() {
  const [uploadedData, setUploadedData] = useState<any[] | null>(null);

  const handleFileUpload = (data: any[], fileName: string) => {
    setUploadedData(data);
    console.log("Uploaded data:", data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Data</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Data</DialogTitle>
          <DialogDescription>
            Upload your data file here. We support CSV and Excel files.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FileUpload
            onUploadComplete={handleFileUpload}
            allowedFileTypes={['.csv', '.xlsx']}
            maxSize={5}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
