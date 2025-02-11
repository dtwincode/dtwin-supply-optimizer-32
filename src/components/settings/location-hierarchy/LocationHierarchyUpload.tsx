
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const LocationHierarchyUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].toLowerCase().split(',').map(h => h.trim());
        const dataRows = rows.slice(1).filter(row => row.trim());

        const locationData = dataRows.map(row => {
          const values = row.split(',').map(v => v.trim());
          return {
            channel_id: values[headers.indexOf('channel id')],
            location_description: values[headers.indexOf('location des')],
            location_id: values[headers.indexOf('location id')],
            location_desc: values[headers.indexOf('location desc')],
            city: values[headers.indexOf('city')],
            region: values[headers.indexOf('region')],
            country: values[headers.indexOf('country')],
            channel: values[headers.indexOf('channel')],
            sub_channel: values[headers.indexOf('sub channel')],
            warehouse: values[headers.indexOf('warehouse')],
            org_id: values[headers.indexOf('org_id')],
            active: values[headers.indexOf('active')]?.toLowerCase() === 'true'
          };
        });

        const { error } = await supabase
          .from('location_hierarchy')
          .insert(locationData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Location hierarchy data uploaded successfully",
        });

      } catch (error) {
        console.error('Error uploading location hierarchy:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload location hierarchy data",
        });
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Location Hierarchy Upload</h3>
        <p className="text-sm text-muted-foreground">
          Upload your location hierarchy data using a CSV file. The file should include columns for Channel ID, Location Description, Location ID, etc.
        </p>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById('location-file')?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload CSV"}
          </Button>
          <input
            id="location-file"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </Card>
  );
};
