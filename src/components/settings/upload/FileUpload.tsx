
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileUp, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getTranslation } from "@/translations";
import { useLanguage } from "@/contexts/LanguageContext";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in bytes
  label?: string;
  supportedFormats?: string;
}

const FileUpload = ({
  onFileSelected,
  acceptedFileTypes = ".csv,.xlsx",
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  label,
  supportedFormats = "CSV, XLSX",
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    
    // Check file type
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const isValidType = acceptedFileTypes.includes(fileExtension || '');
    
    if (!isValidType) {
      setError(`Invalid file type. Supported formats: ${supportedFormats}`);
      return;
    }
    
    // Check file size
    if (selectedFile.size > maxFileSize) {
      setError(`File is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`);
      return;
    }
    
    setFile(selectedFile);
    onFileSelected(selectedFile);
    toast({
      title: "File selected",
      description: `${selectedFile.name} has been selected.`,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-300"
        } ${error ? "border-red-500" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept={acceptedFileTypes}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {file ? (
              <Check className="h-10 w-10 text-green-500" />
            ) : (
              <Upload className="h-10 w-10 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium">
              {label || getTranslation('common.dragAndDrop', language) || "Drag and drop your file here"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {getTranslation('common.or', language) || "or"}
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={!!file}
          >
            <FileUp className="mr-2 h-4 w-4" />
            {file ? file.name : getTranslation('common.browse', language) || "Browse files"}
          </Button>
          
          {error && (
            <div className="flex items-center text-red-500 text-sm mt-2">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            {getTranslation('common.supportedFiles', language) || "Supported formats"}: {supportedFormats}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
