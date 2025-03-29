
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/settings/FileUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { processDataByModule } from "./data-processing/processDataByModule";
import { supabase } from "@/integrations/supabase/client";
import { BufferProfile } from "@/types/inventory";
import { Plus, FileUp, RefreshCw } from "lucide-react";

export function BufferProfilesTab() {
  const [bufferProfiles, setBufferProfiles] = useState<BufferProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch buffer profiles on component mount
  useEffect(() => {
    fetchBufferProfiles();
  }, []);

  const fetchBufferProfiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('buffer_profiles')
        .select('*');

      if (error) {
        throw error;
      }

      // Map to our frontend model
      const profiles: BufferProfile[] = data.map(profile => ({
        id: profile.id,
        name: profile.name,
        description: profile.description || undefined,
        variabilityFactor: profile.variability_factor,
        leadTimeFactor: profile.lead_time_factor,
        moq: profile.moq || undefined,
        lotSizeFactor: profile.lot_size_factor || undefined
      }));

      setBufferProfiles(profiles);
    } catch (error) {
      console.error('Error fetching buffer profiles:', error);
      toast({
        variant: "destructive",
        title: "Failed to load buffer profiles",
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (processedData: any[], errors: any[]) => {
    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation errors",
        description: `Found ${errors.length} errors in the file. Please fix and try again.`
      });
      return;
    }

    // Process the data
    const result = await processDataByModule('buffer_profiles', processedData, []);
    
    if (result.success) {
      toast({
        title: "Upload successful",
        description: result.message
      });
      // Refresh the list
      fetchBufferProfiles();
    } else {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: result.message
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Buffer Profiles</CardTitle>
              <CardDescription>
                Manage buffer profiles for inventory items
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchBufferProfiles} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profiles">
            <TabsList className="mb-4">
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profiles" className="space-y-4">
              {isLoading ? (
                <div className="text-center py-4">Loading buffer profiles...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Variability Factor</TableHead>
                      <TableHead>Lead Time Factor</TableHead>
                      <TableHead>MOQ</TableHead>
                      <TableHead>Lot Size Factor</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bufferProfiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No buffer profiles found. Upload a file or create a new profile.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bufferProfiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {profile.variabilityFactor.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {profile.leadTimeFactor}
                            </Badge>
                          </TableCell>
                          <TableCell>{profile.moq || '-'}</TableCell>
                          <TableCell>{profile.lotSizeFactor || '-'}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {profile.description || '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="upload">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <FileUp className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-xl font-medium">Upload Buffer Profiles</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Upload a CSV or Excel file with buffer profile data. The file should include name, 
                      variability_factor, lead_time_factor, and optionally moq and lot_size_factor.
                    </p>
                    
                    <div className="py-4">
                      <FileUpload 
                        moduleType="buffer_profiles"
                        onDataProcessed={handleFileUpload}
                        acceptedFileTypes=".csv,.xlsx,.xls"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
