
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, FileUp, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BufferProfile } from "@/types/inventory";
import BufferProfilesUpload from "./BufferProfilesUpload";

const BufferProfilesTab = () => {
  const [bufferProfiles, setBufferProfiles] = useState<BufferProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'profiles' | 'upload'>('profiles');
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

  const handleDataUploaded = () => {
    fetchBufferProfiles();
    setActiveView('profiles');
  };

  return (
    <div className="space-y-4">
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
              <Button size="sm" onClick={() => setActiveView(activeView === 'profiles' ? 'upload' : 'profiles')}>
                {activeView === 'profiles' ? (
                  <>
                    <FileUp className="h-4 w-4 mr-1" />
                    Upload
                  </>
                ) : (
                  <>
                    View Profiles
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeView === 'profiles' ? (
            <>
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
                              {profile.variabilityFactor.replace(/_/g, ' ')}
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
            </>
          ) : (
            <BufferProfilesUpload onDataUploaded={handleDataUploaded} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BufferProfilesTab;
