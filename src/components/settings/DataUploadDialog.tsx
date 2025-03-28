
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getTranslation } from '@/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload } from 'lucide-react';

interface DataUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  acceptedFormats?: string;
  onUpload?: (file: File) => Promise<void>;
}

export const DataUploadDialog: React.FC<DataUploadDialogProps> = ({
  open,
  onOpenChange,
  title = 'Upload Data',
  description = 'Upload your data file in CSV or Excel format.',
  acceptedFormats = '.csv, .xlsx, .xls',
  onUpload
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: getTranslation('common.error', language),
        description: getTranslation('settings.selectFileFirst', language) || 'Please select a file first',
        variant: 'destructive'
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      if (onUpload) {
        await onUpload(selectedFile);
      }
      
      toast({
        title: getTranslation('common.success', language),
        description: getTranslation('settings.fileUploaded', language) || 'File uploaded successfully'
      });
      
      onOpenChange(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: getTranslation('common.error', language),
        description: getTranslation('settings.uploadError', language) || 'Error uploading file',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="file">{getTranslation('settings.selectFile', language) || 'Select File'}</Label>
            <Input
              id="file"
              type="file"
              accept={acceptedFormats}
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                {getTranslation('settings.selectedFile', language) || 'Selected'}: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            {getTranslation('common.cancel', language) || 'Cancel'}
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {isUploading 
              ? (getTranslation('settings.uploading', language) || 'Uploading...') 
              : (getTranslation('settings.upload', language) || 'Upload')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
