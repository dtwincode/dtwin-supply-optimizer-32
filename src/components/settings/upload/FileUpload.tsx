
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Cloud, File, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onUploadComplete: (data: any[], originalFileName: string) => void;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
  allowedFileTypes?: string[];
  maxSize?: number;
}

export function FileUpload({ 
  onUploadComplete, 
  onProgress,
  onError,
  allowedFileTypes = ['.csv', '.xlsx'], 
  maxSize = 5 
}: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    setIsLoading(true);
    
    try {
      if (onProgress) {
        onProgress(0);
      }

      const data = await readFile(selectedFile, (progress) => {
        setUploadProgress(progress);
        if (onProgress) {
          onProgress(progress);
        }
      });

      if (typeof onUploadComplete === 'function') {
        await onUploadComplete(data, selectedFile.name);
        setUploadStatus('success');
        // Clear the selected file after successful upload
        setTimeout(() => {
          setSelectedFile(null);
          setUploadStatus('idle');
        }, 3000);
      } else {
        console.error('onUploadComplete is not a function');
        setUploadStatus('error');
        if (onError) onError('Upload handler is not properly configured');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus('error');
      if (onError) onError(error instanceof Error ? error.message : 'Unknown error processing file');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setUploadStatus('idle');
  }, []);

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
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-muted' : 'border-muted-foreground/25',
          selectedFile ? 'border-green-500/50 bg-green-50 dark:bg-green-950/10' : ''
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
              {selectedFile ? (
                <>
                  <CheckCircle className="h-10 w-10 text-green-500" />
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : isDragActive ? (
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
      
      {selectedFile && (
        <div className="flex flex-col gap-2">
          {uploadStatus === 'uploading' && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full h-2" />
              <p className="text-xs text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-2 rounded flex items-center gap-2 justify-center">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Upload successful!</span>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-2 rounded flex items-center gap-2 justify-center">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Upload failed. Please try again.</span>
            </div>
          )}
          
          {uploadStatus === 'idle' && (
            <Button 
              onClick={handleUpload} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Upload File'
              )}
            </Button>
          )}
        </div>
      )}
      
      <p className="mt-2 text-xs text-muted-foreground">
        Allowed types: {allowedFileTypes.join(', ')} (Max size: {maxSize}MB)
      </p>
    </div>
  );
}
