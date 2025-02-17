
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Cloud, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadComplete: (data: any[], originalFileName: string) => void;
  onProgress?: (progress: number) => void;
  allowedFileTypes?: string[];
  maxSize?: number;
}

export function FileUpload({ 
  onUploadComplete, 
  onProgress,
  allowedFileTypes = ['.csv', '.xlsx'], 
  maxSize = 5 
}: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);
    const file = acceptedFiles[0];

    try {
      if (onProgress) {
        onProgress(0);
      }

      const data = await readFile(file, (progress) => {
        if (onProgress) {
          onProgress(progress);
        }
      });

      if (typeof onUploadComplete === 'function') {
        onUploadComplete(data, file.name);
      } else {
        console.error('onUploadComplete is not a function');
      }
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onUploadComplete, onProgress]);

  const fileTypes: { [key: string]: string[] } = {
    'text/csv': ['.csv'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls']
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes,
    maxSize: maxSize * 1024 * 1024,
    multiple: false
  });

  const readFile = (file: File, onProgressUpdate?: (progress: number) => void): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgressUpdate) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgressUpdate(progress);
        }
      };

      reader.onload = (e) => {
        try {
          if (onProgressUpdate) {
            onProgressUpdate(90); // File is loaded, now processing
          }
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (onProgressUpdate) {
            onProgressUpdate(100); // Processing complete
          }
          
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
