
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, FileUp, CheckCircle2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

const InventoryDataUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setUploadSuccess(false);
    
    // Preview first file
    if (acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // This is a simplistic CSV parser just for preview
          const text = reader.result as string;
          const lines = text.split('\n').filter(line => line.trim() !== '');
          const headers = lines[0].split(',');
          
          const data = lines.slice(1, 6).map(line => {
            const values = line.split(',');
            return headers.reduce((obj: any, header, index) => {
              obj[header.trim()] = values[index]?.trim() || '';
              return obj;
            }, {});
          });
          
          setPreviewData(data);
          toast.success('File parsed successfully');
        } catch (error) {
          console.error('Error parsing CSV', error);
          toast.error('Error parsing CSV file');
          setPreviewData([]);
        }
      };
      reader.readAsText(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv', '.xls', '.xlsx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  });

  const handleUpload = () => {
    if (files.length === 0) {
      toast.error('Please select a file first');
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadSuccess(true);
          toast.success('Inventory data uploaded successfully');
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleReset = () => {
    setFiles([]);
    setPreviewData([]);
    setUploadSuccess(false);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Inventory Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload your inventory data in CSV format. The file should include SKU, location, current stock levels, 
            min/max stock levels, and buffer zones.
          </p>
          
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}
              ${uploading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <input {...getInputProps()} />
            <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            
            {isDragActive ? (
              <p className="text-sm font-medium">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-sm font-medium mb-1">Drag & drop a file here, or click to select</p>
                <p className="text-xs text-muted-foreground">Supports CSV, XLS, XLSX</p>
              </div>
            )}
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium">{files[0].name}</p>
                  <p className="text-muted-foreground">{(files[0].size / 1024).toFixed(1)} KB</p>
                </div>
                {uploadSuccess ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Remove
                  </Button>
                )}
              </div>
              
              {uploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-xs text-center text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading || uploadSuccess} 
                  className="w-full"
                >
                  {uploadSuccess ? 'Uploaded' : 'Upload Data'}
                </Button>
                
                {uploadSuccess && (
                  <Button variant="outline" onClick={handleReset} className="flex-shrink-0">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    New File
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Required Format</h3>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm mb-3">Your CSV file should include these columns:</p>
              <div className="text-xs space-y-1 mb-4">
                <div className="flex">
                  <span className="font-semibold text-primary w-32">sku</span>
                  <span>Product SKU identifier</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-primary w-32">location_id</span>
                  <span>Warehouse location ID</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-primary w-32">current_stock</span>
                  <span>Current stock quantity</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-primary w-32">min_stock</span>
                  <span>Minimum stock level</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-primary w-32">max_stock</span>
                  <span>Maximum stock level</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-primary w-32">safety_stock</span>
                  <span>Safety stock quantity</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-primary w-32">red_zone</span>
                  <span>Red buffer zone quantity</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-primary w-32">yellow_zone</span>
                  <span>Yellow buffer zone quantity</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-primary w-32">green_zone</span>
                  <span>Green buffer zone quantity</span>
                </div>
              </div>
              
              <Alert variant="warning" className="mb-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Please ensure your data is clean and in the correct format to avoid errors.
                </AlertDescription>
              </Alert>
              
              <Button variant="outline" size="sm" className="w-full">
                Download Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {previewData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Data Preview</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(previewData[0]).map(header => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).map((cell, j) => (
                      <TableCell key={j}>{cell as string}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Showing first 5 rows of data
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryDataUpload;
