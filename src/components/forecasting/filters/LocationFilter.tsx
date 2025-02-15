
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
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LocationFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  regions: string[];
  cities: { [key: string]: string[] };
}

interface LocationData {
  region: string;
  city: string;
  [key: string]: any;
}

export function LocationFilter({
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
  regions,
  cities,
}: LocationFilterProps) {
  const defaultColumns = ['region', 'city'];
  const [availableColumns, setAvailableColumns] = useState<string[]>(defaultColumns);

  // Fetch column selections for location hierarchy
  const { data: columnSelections, isLoading: isLoadingColumns } = useQuery({
    queryKey: ['columnSelections', 'location_hierarchy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hierarchy_column_selections')
        .select('selected_columns')
        .eq('table_name', 'location_hierarchy')
        .maybeSingle();

      if (error) {
        console.error('Error fetching column selections:', error);
        return defaultColumns;
      }

      return data?.selected_columns || defaultColumns;
    }
  });

  // Fetch locations data with selected columns
  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', columnSelections],
    queryFn: async () => {
      console.log('Fetching location data with columns:', columnSelections);
      
      const { data, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('data')
        .eq('hierarchy_type', 'location')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching location data:', error);
        return {
          regions: [],
          cities: {}
        };
      }

      console.log('Raw location data:', data);

      // Ensure hierarchyData is an array of LocationData
      const hierarchyData = Array.isArray(data?.data) ? data.data as LocationData[] : [];
      console.log('Processed hierarchy data:', hierarchyData);
      
      const uniqueRegions = new Set<string>();
      const citiesByRegion: { [key: string]: Set<string> } = {};

      // Process the hierarchy data
      hierarchyData.forEach((location: LocationData) => {
        if (location.region) {
          uniqueRegions.add(location.region);
          if (location.city) {
            if (!citiesByRegion[location.region]) {
              citiesByRegion[location.region] = new Set<string>();
            }
            citiesByRegion[location.region].add(location.city);
          }
        }
      });

      const result = {
        regions: Array.from(uniqueRegions).sort(),
        cities: Object.fromEntries(
          Object.entries(citiesByRegion).map(([region, cities]) => [
            region,
            Array.from(cities).sort()
          ])
        )
      };

      console.log('Processed location data:', result);
      return result;
    },
    enabled: !!columnSelections
  });

  useEffect(() => {
    if (Array.isArray(columnSelections)) {
      setAvailableColumns(columnSelections);
    } else {
      setAvailableColumns(defaultColumns);
    }
  }, [columnSelections]);

  if (isLoadingColumns || isLoadingLocations) {
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
