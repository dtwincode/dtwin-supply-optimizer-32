
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { HierarchyTableView } from '../hierarchy/HierarchyTableView';
import { useQuery } from "@tanstack/react-query";

export function LocationHierarchyUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: locationData, refetch } = useQuery({
    queryKey: ['locationHierarchy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_hierarchy')
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
      // First, upload the file to Supabase storage
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('hierarchy-uploads')
        .upload(fileName, uploadedFile);

      if (uploadError) throw uploadError;

      // Then call the process-hierarchy function to get headers
      const { data, error } = await supabase.functions.invoke('process-hierarchy', {
        body: { fileName, type: 'location' },
      });

      if (error) throw error;

      if (data.headers) {
        setColumns(data.headers);
      }

      toast({
        title: "Success",
        description: "File uploaded successfully. Please map the columns to hierarchy levels.",
      });

      refetch();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Location Hierarchy</h3>
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="outline"
            onClick={() => document.getElementById('location-file')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <input
            id="location-file"
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={handleFileUpload}
          />
          {file && <span className="text-sm text-muted-foreground">{file.name}</span>}
        </div>
      </Card>

      {columns.length > 0 && (
        <HierarchyTableView 
          tableName="location_hierarchy"
          data={locationData || []}
          columns={columns}
        />
      )}
    </div>
  );
}
