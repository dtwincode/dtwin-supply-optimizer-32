
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { HierarchyTableView } from '../hierarchy/HierarchyTableView';
import { useQuery } from "@tanstack/react-query";

export function ProductHierarchyUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: productData, refetch } = useQuery({
    queryKey: ['productHierarchy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_hierarchy')
        .select('*')
        .limit(100);
      
      if (error) throw error;
      return data;
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      // First, upload the file to Supabase storage
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('hierarchy-uploads')
        .upload(fileName, uploadedFile);

      if (uploadError) throw uploadError;

      // Then call the process-hierarchy function
      const { data, error } = await supabase.functions.invoke('process-hierarchy', {
        body: { fileName, type: 'product' }, // Add type to differentiate product hierarchy
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product hierarchy file uploaded and processed successfully",
      });

      refetch();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload and process product hierarchy file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Product Hierarchy</h3>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('product-file')?.click()}
            disabled={isUploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Select File'}
          </Button>
          <input
            id="product-file"
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={handleFileUpload}
          />
          {file && <span className="text-sm text-muted-foreground">{file.name}</span>}
        </div>
      </Card>

      {productData && productData.length > 0 && (
        <HierarchyTableView 
          tableName="product_hierarchy"
          data={productData}
        />
      )}
    </div>
  );
}
