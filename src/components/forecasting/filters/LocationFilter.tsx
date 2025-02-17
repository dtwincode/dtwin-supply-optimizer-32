
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LocationFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

interface LocationData {
  region: string;
  city: string;
}

export function LocationFilter({
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
}: LocationFilterProps) {
  const { toast } = useToast();
  const [filterLabels, setFilterLabels] = useState({
    first: "",
    second: ""
  });

  // Fetch saved hierarchy files
  const { data: savedFiles } = useQuery({
    queryKey: ['saved-location-hierarchies'],
    queryFn: async () => {
      const { data: files, error } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved hierarchies:', error);
        return [];
      }

      return files || [];
    }
  });

  // Fetch active hierarchy data
  const { data: locationsData, isLoading, refetch } = useQuery({
    queryKey: ['locations', 'hierarchy'],
    queryFn: async () => {
      const { data: activeVersionData, error: versionError } = await supabase
        .from('permanent_hierarchy_data')
        .select('data')
        .eq('hierarchy_type', 'location_hierarchy')
        .eq('is_active', true)
        .maybeSingle();

      if (versionError) {
        console.error('Error fetching location hierarchy:', versionError);
        return {
          regions: [],
          cities: {},
          labels: { first: "", second: "" }
        };
      }

      if (!activeVersionData?.data || !Array.isArray(activeVersionData.data)) {
        console.log('No location hierarchy data found or invalid data format');
        return {
          regions: [],
          cities: {},
          labels: { first: "", second: "" }
        };
      }

      try {
        const hierarchyData = activeVersionData.data as unknown as LocationData[];
        if (!hierarchyData.every(item => 
          typeof item === 'object' && 
          'region' in item && 
          'city' in item
        )) {
          console.error('Invalid data format in hierarchy data');
          return {
            regions: [],
            cities: {},
            labels: { first: "", second: "" }
          };
        }

        const uniqueRegions = new Set<string>();
        const citiesByRegion: { [key: string]: Set<string> } = {};

        hierarchyData.forEach((row: LocationData) => {
          if (row.region) {
            uniqueRegions.add(row.region);
            if (!citiesByRegion[row.region]) {
              citiesByRegion[row.region] = new Set<string>();
            }
            if (row.city) {
              citiesByRegion[row.region].add(row.city);
            }
          }
        });

        // Get the labels from the active hierarchy metadata
        const { data: activeFile, error: labelError } = await supabase
          .from('permanent_hierarchy_files')
          .select('metadata')
          .eq('id', activeVersionData.id)
          .single();

        let labels = { first: "", second: "" };
        if (!labelError && activeFile?.metadata?.labels) {
          labels = activeFile.metadata.labels;
          setFilterLabels(labels);
        }

        return {
          regions: Array.from(uniqueRegions).sort(),
          cities: Object.fromEntries(
            Object.entries(citiesByRegion).map(([region, cities]) => [
              region,
              Array.from(cities).sort()
            ])
          ),
          labels
        };
      } catch (error) {
        console.error('Error processing location hierarchy data:', error);
        return {
          regions: [],
          cities: {},
          labels: { first: "", second: "" }
        };
      }
    }
  });

  const handleImportHierarchy = async (fileId: string) => {
    try {
      // Get the file data and metadata
      const { data: fileData, error: fileError } = await supabase
        .from('permanent_hierarchy_files')
        .select('data, metadata')
        .eq('id', fileId)
        .single();

      if (fileError) throw fileError;

      // Get the current max version
      const { data: versionData, error: versionError } = await supabase
        .from('permanent_hierarchy_data')
        .select('version')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (versionError && !versionError.message.includes('No rows returned')) {
        throw versionError;
      }

      const nextVersion = (versionData?.version || 0) + 1;

      // Insert as new active hierarchy with version
      const { error: insertError } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: 'location_hierarchy',
          data: fileData.data,
          is_active: true,
          version: nextVersion,
          source_upload_id: fileId
        });

      if (insertError) throw insertError;

      // Deactivate other hierarchies
      const { error: updateError } = await supabase
        .from('permanent_hierarchy_data')
        .update({ is_active: false })
        .neq('version', nextVersion)
        .eq('hierarchy_type', 'location_hierarchy');

      if (updateError) throw updateError;

      // Update filter labels from metadata
      if (fileData.metadata?.labels) {
        setFilterLabels(fileData.metadata.labels);
      }

      // Reset selections
      setSelectedRegion('all');
      setSelectedCity('all');

      // Refetch the data
      await refetch();

      toast({
        title: "Success",
        description: "Location hierarchy imported successfully"
      });
    } catch (error) {
      console.error('Error importing hierarchy:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to import location hierarchy"
      });
    }
  };

  // Reset city when region changes
  useEffect(() => {
    if (selectedRegion === "all") {
      setSelectedCity("all");
    }
  }, [selectedRegion, setSelectedCity]);

  if (isLoading) {
    return (
      <Card className="p-6 w-full">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading filters...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Location Filters</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {savedFiles?.map((file) => (
                <DropdownMenuItem
                  key={file.id}
                  onClick={() => handleImportHierarchy(file.id)}
                >
                  {file.original_name}
                </DropdownMenuItem>
              ))}
              {(!savedFiles || savedFiles.length === 0) && (
                <DropdownMenuItem disabled>
                  No saved hierarchies
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{filterLabels.first || "Select First Level"}</label>
            <Select
              value={selectedRegion}
              onValueChange={setSelectedRegion}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${filterLabels.first || 'value'}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{`All ${filterLabels.first || 'Values'}`}</SelectItem>
                {locationsData?.regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{filterLabels.second || "Select Second Level"}</label>
            <Select
              value={selectedCity}
              onValueChange={setSelectedCity}
              disabled={selectedRegion === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${filterLabels.second || 'value'}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{`All ${filterLabels.second || 'Values'}`}</SelectItem>
                {selectedRegion !== "all" &&
                  locationsData?.cities[selectedRegion]?.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
