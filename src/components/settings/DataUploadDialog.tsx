
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import FileUpload from './upload/FileUpload';
import { useToast } from '@/hooks/use-toast';

export interface DataUploadDialogProps {
  onUploadComplete?: (data: any) => void;
}

export const DataUploadDialog: React.FC<DataUploadDialogProps> = ({ onUploadComplete }) => {
  const [open, setOpen] = useState(false);
  const [connectionName, setConnectionName] = useState('');
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleUploadComplete = (files: File[]) => {
    if (files.length > 0) {
      toast({
        title: getTranslation('settings.upload.success', language),
        description: "Integration data uploaded successfully"
      });
      
      if (onUploadComplete) {
        onUploadComplete({
          name: connectionName,
          file: files[0].name,
          timestamp: new Date().toISOString()
        });
      }
      
      setOpen(false);
    }
  };

  const handleError = (error: string) => {
    toast({
      variant: "destructive",
      title: getTranslation('settings.upload.error', language),
      description: error
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{getTranslation('settings.upload.title', language)}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTranslation('settings.upload.title', language)}</DialogTitle>
          <DialogDescription>
            {getTranslation('settings.upload.description', language)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="connection-name" className="text-right">
              Connection Name
            </Label>
            <Input
              id="connection-name"
              value={connectionName}
              onChange={(e) => setConnectionName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              File
            </Label>
            <div className="col-span-3">
              <FileUpload
                onUploadComplete={handleUploadComplete}
                onError={handleError}
                allowedFileTypes={[".csv", ".xlsx", ".json"]}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {getTranslation('common.cancel', language)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
