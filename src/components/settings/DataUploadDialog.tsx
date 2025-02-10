
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DataUploadDialogProps, ValidationError } from "./validation/types";
import { validateData } from "./validation/validateData";
import { processDataByModule } from "./data-processing/processDataByModule";
import { TemplateDownloader } from "./template/TemplateDownloader";
import { ValidationErrorDisplay } from "./validation/ValidationErrorDisplay";
import { FileUpload } from "./upload/FileUpload";

export function DataUploadDialog({ module, onDataUploaded }: DataUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const processUpload = async () => {
    if (!file) return;

    try {
      setIsValidating(true);
      setProgress(10);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        const dataRows = rows.slice(1).filter(row => row.trim());
        
        setProgress(30);
        
        // Validate data
        const errors = await validateData(headers, dataRows.map(row => row.split(',')), module);
        setValidationErrors(errors);
        
        setProgress(50);

        if (errors.length > 0) {
          // Convert ValidationError[] to a format compatible with Json type
          const jsonErrors = errors.map(error => ({
            row: error.row,
            column: error.column,
            message: error.message
          }));

          // Log validation errors
          await supabase.from('data_validation_logs').insert({
            module,
            file_name: file.name,
            row_count: dataRows.length,
            error_count: errors.length,
            validation_errors: jsonErrors,
            status: 'failed'
          });

          toast({
            variant: "destructive",
            title: "Validation Failed",
            description: `Found ${errors.length} errors in the data`,
          });
          setIsValidating(false);
          return;
        }

        setProgress(70);

        // Process data rows based on module type
        const { error } = await processDataByModule(module, headers, dataRows);

        if (error) throw error;

        // Log successful validation
        await supabase.from('data_validation_logs').insert({
          module,
          file_name: file.name,
          row_count: dataRows.length,
          error_count: 0,
          status: 'completed'
        });

        setProgress(100);
        
        toast({
          title: "Success",
          description: `Data uploaded successfully for ${module} module`,
        });
        setIsOpen(false);
        onDataUploaded();
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing upload:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process upload",
      });
    } finally {
      setIsValidating(false);
      setProgress(0);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setValidationErrors([]);
    setProgress(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload {module} Data</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <TemplateDownloader module={module} />
            
            <FileUpload
              isValidating={isValidating}
              onFileSelect={handleFileSelect}
              onProcessUpload={processUpload}
              progress={progress}
              file={file}
              hasValidationErrors={validationErrors.length > 0}
            />

            <ValidationErrorDisplay errors={validationErrors} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
