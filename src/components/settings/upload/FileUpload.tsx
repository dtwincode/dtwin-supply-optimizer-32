
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  isValidating: boolean;
  onFileSelect: (file: File) => void;
  onProcessUpload: () => void;
  progress: number;
  file: File | null;
  hasValidationErrors: boolean;
}

export function FileUpload({
  isValidating,
  onFileSelect,
  onProcessUpload,
  progress,
  file,
  hasValidationErrors,
}: FileUploadProps) {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a CSV file",
        });
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="cursor-pointer"
        disabled={isValidating}
      />

      {isValidating && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Validating and processing data...
          </p>
        </div>
      )}

      {file && !isValidating && (
        <Button 
          onClick={onProcessUpload} 
          className="gap-2" 
          disabled={hasValidationErrors}
        >
          <Upload className="h-4 w-4" />
          Process Upload
        </Button>
      )}
    </div>
  );
}
