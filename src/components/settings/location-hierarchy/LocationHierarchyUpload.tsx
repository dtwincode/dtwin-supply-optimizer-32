
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

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('type', 'location');

    try {
      const response = await fetch('/api/upload-hierarchy', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      toast({
        title: "Success",
        description: "Location hierarchy file uploaded successfully",
      });

      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload location hierarchy file",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Location Hierarchy</h3>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('location-file')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Select File
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

      {locationData && locationData.length > 0 && (
        <HierarchyTableView 
          tableName="location_hierarchy"
          data={locationData}
        />
      )}
    </div>
  );
}
