
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { processDataByModule } from "@/components/settings/data-processing/processDataByModule";
import { supabase } from "@/lib/supabaseClient";
import { DataTable } from "@/components/ui/data-table";
import { 
  BufferProfile 
} from "@/types/inventory";

export interface BufferProfilesUploadProps {
  onDataUploaded?: (data: any) => void;
}

const BufferProfilesUpload: React.FC<BufferProfilesUploadProps> = ({ onDataUploaded }) => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingProfiles, setExistingProfiles] = useState<BufferProfile[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchExistingProfiles();
  }, []);

  const fetchExistingProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('buffer_profiles')
        .select('*');

      if (error) {
        throw error;
      }

      setExistingProfiles(data || []);
    } catch (error) {
      console.error('Error fetching buffer profiles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load existing buffer profiles",
      });
    }
  };

  const handleFileUpload = (data: any[], fileName: string) => {
    setUploadedData(data);
    setError(null);
    
    toast({
      title: "Data upload success",
      description: `Uploaded ${data.length} records from ${fileName}`,
    });
    
    if (onDataUploaded) {
      onDataUploaded(data);
    }
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: errorMessage,
    });
  };

  const handleSaveData = async () => {
    if (!uploadedData.length) {
      toast({
        variant: "destructive",
        title: "No data",
        description: "Please upload buffer profile data first",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Process the data and save it
      const result = await processDataByModule('buffer_profiles', uploadedData, []);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Refresh the existing profiles
        fetchExistingProfiles();
        // Clear uploaded data
        setUploadedData([]);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error saving buffer profiles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save buffer profiles",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "variability_factor",
      header: "Variability",
      cell: ({ row }: { row: any }) => {
        const value = row.original.variability_factor;
        return (
          <Badge variant={value === "high_variability" ? "destructive" : value === "low_variability" ? "success" : "secondary"}>
            {value?.replace("_variability", "") || ""}
          </Badge>
        );
      }
    },
    {
      accessorKey: "lead_time_factor",
      header: "Lead Time",
      cell: ({ row }: { row: any }) => {
        const value = row.original.lead_time_factor;
        return (
          <Badge variant={value === "long" ? "destructive" : value === "short" ? "success" : "secondary"}>
            {value || ""}
          </Badge>
        );
      }
    },
    {
      accessorKey: "moq",
      header: "MOQ",
    },
    {
      accessorKey: "lot_size_factor",
      header: "Lot Size Factor",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }: { row: any }) => {
        return new Date(row.original.created_at).toLocaleDateString();
      }
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Buffer Profiles Management</CardTitle>
        <CardDescription>
          Upload and manage buffer profiles for inventory management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Upload buffer profiles with required fields:
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">name</Badge>
                <Badge variant="outline">variability_factor</Badge>
                <Badge variant="outline">lead_time_factor</Badge>
              </div>
              <div className="mt-2">
                Optional fields:
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge variant="secondary">description</Badge>
                  <Badge variant="secondary">moq</Badge>
                  <Badge variant="secondary">lot_size_factor</Badge>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  <strong>variability_factor:</strong> 'low_variability', 'medium_variability', or 'high_variability'<br />
                  <strong>lead_time_factor:</strong> 'short', 'medium', or 'long'
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <FileUpload
            onUploadComplete={handleFileUpload}
            onError={handleUploadError}
            allowedFileTypes={[".csv", ".xlsx"]}
          />

          {uploadedData.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">
                Preview of uploaded data ({uploadedData.length} records):
              </div>
              <div className="border rounded-md p-4 max-h-60 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(uploadedData.slice(0, 5), null, 2)}
                  {uploadedData.length > 5 && '...'}
                </pre>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleSaveData}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Buffer Profiles"}
                </Button>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {existingProfiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Existing Buffer Profiles</h3>
              <DataTable
                columns={columns}
                data={existingProfiles}
                pagination={{
                  pageIndex: 0,
                  pageSize: 10,
                  pageCount: Math.ceil(existingProfiles.length / 10),
                  onPageChange: () => {}
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BufferProfilesUpload;
