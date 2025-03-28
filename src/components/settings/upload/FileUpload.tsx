
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onUploadComplete: (data: any[], fileName: string) => void;
  onError: (error: string) => void;
  allowedFileTypes?: string[];
  maxSizeMB?: number;
}

const FileUpload = ({ onUploadComplete, onError, allowedFileTypes = ['.csv', '.xlsx'], maxSizeMB = 10 }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      if (!allowedFileTypes.includes(fileExtension.toLowerCase())) {
        onError(`Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`);
        return;
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        onError(`File size exceeds the ${maxSizeMB}MB limit.`);
        return;
      }

      setIsUploading(true);
      setFileName(file.name);

      // Process file data
      const data = await parseFile(file);
      
      onUploadComplete(data, file.name);
    } catch (error) {
      console.error("Error processing file:", error);
      onError("Failed to process the file. Please check the file format.");
    } finally {
      setIsUploading(false);
    }
  };

  const parseFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          if (!data) {
            reject(new Error("No data found in file"));
            return;
          }
          
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsBinaryString(file);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={allowedFileTypes.join(',')}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          {isUploading ? (
            <div className="animate-pulse">
              <File className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Processing {fileName}...</p>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">
                {allowedFileTypes.join(', ')} (Max {maxSizeMB}MB)
              </p>
            </>
          )}
        </label>
      </div>
      
      {fileName && !isUploading && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>File "{fileName}" uploaded successfully.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUpload;
