
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Cloud, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadComplete: (data: any[], originalFileName: string) => void;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in MB
}

export function FileUpload({ 
  onUploadComplete, 
  allowedFileTypes = ['.csv', '.xlsx'], 
  maxFileSize = 5 
}: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true);
    const file = acceptedFiles[0];

    try {
      const data = await readFile(file);
      onUploadComplete(data, file.name);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedFileTypes.reduce((acc, type) => ({
      ...acc,
      [type]: []
    }), {}),
    maxSize: maxFileSize * 1024 * 1024,
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
        Allowed types: {allowedFileTypes.join(', ')} (Max size: {maxFileSize}MB)
      </p>
    </div>
  );
}
