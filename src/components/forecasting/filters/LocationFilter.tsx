
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
  // Fetch locations data from permanent database
  const { data: locationsData, isLoading } = useQuery({
    queryKey: ['locations', 'hierarchy'],
    queryFn: async () => {
      // Get the active version of the location hierarchy
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
          cities: {}
        };
      }

      if (!activeVersionData?.data || !Array.isArray(activeVersionData.data)) {
        console.log('No location hierarchy data found or invalid data format');
        return {
          regions: [],
          cities: {}
        };
      }

      try {
        // Type assertion with runtime validation
        const hierarchyData = activeVersionData.data as unknown as LocationData[];
        if (!hierarchyData.every(item => 
          typeof item === 'object' && 
          'region' in item && 
          'city' in item
        )) {
          console.error('Invalid data format in hierarchy data');
          return {
            regions: [],
            cities: {}
          };
        }

        const uniqueRegions = new Set<string>();
        const citiesByRegion: { [key: string]: Set<string> } = {};

        // Extract unique regions and cities from the hierarchy data
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

        // Convert Sets to sorted arrays
        return {
          regions: Array.from(uniqueRegions).sort(),
          cities: Object.fromEntries(
            Object.entries(citiesByRegion).map(([region, cities]) => [
              region,
              Array.from(cities).sort()
            ])
          )
        };
      } catch (error) {
        console.error('Error processing location hierarchy data:', error);
        return {
          regions: [],
          cities: {}
        };
      }
    }
  });

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
        <h3 className="text-lg font-medium mb-4">Location Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Region</label>
            <Select
              value={selectedRegion}
              onValueChange={setSelectedRegion}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {locationsData?.regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Select
              value={selectedCity}
              onValueChange={setSelectedCity}
              disabled={selectedRegion === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
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
