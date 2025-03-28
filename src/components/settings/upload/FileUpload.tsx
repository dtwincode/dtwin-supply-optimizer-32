
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { FileUp, X, FileCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onUploadComplete: (files: File[]) => void;
  onError?: (error: string) => void;
  allowedFileTypes?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  onFileSelected?: (file: File) => void;
  acceptedFileTypes?: string;
  label?: string;
  supportedFormats?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onError,
  allowedFileTypes = [],
  maxSizeMB = 5,
  multiple = true,
  onFileSelected,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter files by allowed types if specified
    const filteredFiles = allowedFileTypes.length > 0
      ? acceptedFiles.filter(file => {
          const extension = file.name.split('.').pop()?.toLowerCase();
          return extension && allowedFileTypes.some(type => 
            type.toLowerCase().includes(extension) || type === '*'
          );
        })
      : acceptedFiles;
    
    // Filter files by size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const sizeFilteredFiles = filteredFiles.filter(file => file.size <= maxSizeBytes);
    
    if (sizeFilteredFiles.length < filteredFiles.length) {
      console.warn(`${filteredFiles.length - sizeFilteredFiles.length} files exceeded the maximum size of ${maxSizeMB}MB`);
      if (onError) {
        onError(`${filteredFiles.length - sizeFilteredFiles.length} files exceeded the maximum size of ${maxSizeMB}MB`);
      }
    }
    
    setFiles(prev => multiple ? [...prev, ...sizeFilteredFiles] : sizeFilteredFiles);
    
    // Handle single file selection for backward compatibility
    if (onFileSelected && sizeFilteredFiles.length > 0) {
      onFileSelected(sizeFilteredFiles[0]);
    }
  }, [allowedFileTypes, maxSizeMB, multiple, onFileSelected, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple,
    accept: allowedFileTypes.length > 0 
      ? allowedFileTypes.reduce((acc, type) => {
          // Convert file extensions to mime types
          if (type.startsWith('.')) {
            const ext = type.substring(1);
            if (ext === 'pdf') acc['application/pdf'] = [type];
            else if (ext === 'docx') acc['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = [type];
            else if (ext === 'xlsx') acc['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = [type];
            else if (ext === 'jpg' || ext === 'jpeg') acc['image/jpeg'] = ['.jpg', '.jpeg'];
            else if (ext === 'png') acc['image/png'] = [type];
            else acc[`application/${ext}`] = [type];
          }
          return acc;
        }, {} as Record<string, string[]>)
      : undefined,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      // In a real implementation, you would upload the files here
      // For demonstration, we'll just pass the files to the callback
      onUploadComplete(files);
      
      // Simulate completion
      setTimeout(() => {
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploading(false);
          setFiles([]);
          setUploadProgress(0);
        }, 500);
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      if (onError) {
        onError('Upload failed. Please try again.');
      }
      setUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'
        }`}
      >
        <input {...getInputProps()} />
        <FileUp className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">
          {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select files'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {allowedFileTypes.length > 0
            ? `Allowed file types: ${allowedFileTypes.join(', ')}`
            : 'All file types are allowed'}
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum file size: {maxSizeMB}MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-3 bg-muted font-medium text-sm">
            Selected Files ({files.length})
          </div>
          <ul className="divide-y">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <FileCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          <div className="p-3 border-t bg-muted flex justify-between items-center">
            {uploading ? (
              <div className="w-full space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleUpload}
                className="ml-auto"
              >
                Upload {files.length} {files.length === 1 ? 'file' : 'files'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
