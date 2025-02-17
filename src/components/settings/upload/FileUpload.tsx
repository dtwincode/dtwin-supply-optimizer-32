
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Cloud, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  onUploadComplete: (data: any[], originalFileName: string) => void;
  onUploadSuccess?: (data: any[], uploadId: string) => void;
  onUploadError?: (error: string) => void;
  allowedFileTypes?: string[];
  maxSize?: number; // in MB
  module?: string;
  accept?: Record<string, string[]>;
}

export function FileUpload({ 
  onUploadComplete, 
  onUploadSuccess,
  onUploadError,
  allowedFileTypes = ['.csv', '.xlsx'], 
  maxSize = 5,
  module,
  accept 
}: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);
    const file = acceptedFiles[0];

    try {
      const data = await readFile(file);
      onUploadComplete(data, file.name);
      
      // If additional success callback is provided
      if (onUploadSuccess) {
        const uploadId = `${module}_${Date.now()}`;
        onUploadSuccess(data, uploadId);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Error processing file');
    } finally {
      setIsLoading(false);
    }
  }, [onUploadComplete, onUploadSuccess, onUploadError, module]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || allowedFileTypes.reduce((acc, type) => ({
      ...acc,
      [type]: []
    }), {}),
    maxSize: maxSize * 1024 * 1024,
    multiple: false
  });

  const readFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-muted' : 'border-muted-foreground/25'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Processing file...</p>
            </>
          ) : (
            <>
              {isDragActive ? (
                <>
                  <Cloud className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">Drop the file here</p>
                </>
              ) : (
                <>
                  <File className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Drag & drop a file here, or click to select
                  </p>
                  <Button variant="secondary" size="sm">
                    Choose File
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Allowed types: {allowedFileTypes.join(', ')} (Max size: {maxSize}MB)
      </p>
    </div>
  );
}
