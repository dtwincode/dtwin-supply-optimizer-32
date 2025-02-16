
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onUploadComplete: (data: any[]) => void;
  allowedFileTypes: string[];
  maxFileSize: number;
}

export function FileUpload({
  onUploadComplete,
  allowedFileTypes,
  maxFileSize,
}: FileUploadProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!allowedFileTypes.includes(`.${fileExtension}`)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: `Please upload one of: ${allowedFileTypes.join(', ')}`,
        });
        return;
      }

      // Check file size (in MB)
      if (file.size > maxFileSize * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: `File size must be less than ${maxFileSize}MB`,
        });
        return;
      }

      setFile(file);
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsValidating(true);
    setProgress(0);
    
    try {
      const reader = new FileReader();
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      };

      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim());
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index];
              return obj;
            }, {} as Record<string, string>);
          });

        onUploadComplete(data);
        setProgress(100);
        setIsValidating(false);
      };

      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to read file",
        });
        setIsValidating(false);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process file",
      });
      setIsValidating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="file"
        accept={allowedFileTypes.join(',')}
        onChange={handleFileSelect}
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
    </div>
  );
}
