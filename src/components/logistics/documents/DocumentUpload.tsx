
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/settings/upload/FileUpload';
import { uploadDocument } from '@/services/logisticsDocumentService';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  orderId?: string;
  onUploadComplete?: () => void;
}

export const DocumentUpload = ({ orderId = '', onUploadComplete }: DocumentUploadProps) => {
  const [documentType, setDocumentType] = useState('');
  const { toast } = useToast();

  const handleUpload = async (files: File[]) => {
    try {
      const file = files[0];
      await uploadDocument(orderId, documentType, file);
      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload document"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="documentType">Document Type</Label>
        <Input
          id="documentType"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          placeholder="e.g., Invoice, Bill of Lading"
        />
      </div>
      <FileUpload
        onUploadComplete={handleUpload}
        allowedFileTypes={['.pdf', '.doc', '.docx']}
        maxSize={10}
      />
    </div>
  );
};
