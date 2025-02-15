
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
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  // Fetch column selections
  const { data: columnSelections, isLoading: isLoadingColumns } = useQuery({
    queryKey: ['columnSelections', 'location_hierarchy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hierarchy_column_selections')
        .select('selected_columns')
        .eq('table_name', 'location_hierarchy')
        .maybeSingle();

      if (error) throw error;
      return data?.selected_columns || [];
    }
  });

  // Fetch locations data
  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('*')
        .eq('hierarchy_type', 'location')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Ensure data is an array and has the correct shape
      const hierarchyData = Array.isArray(data?.data) ? data.data as LocationData[] : [];
      
      // Process the data to get unique regions and cities
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

      return {
        regions: Array.from(uniqueRegions).sort(),
        cities: Object.fromEntries(
          Object.entries(citiesByRegion).map(([region, cities]) => [
            region,
            Array.from(cities).sort()
          ])
        )
      };
    }
  });

  useEffect(() => {
    if (columnSelections && Array.isArray(columnSelections)) {
      setAvailableColumns(columnSelections);
    } else {
      setAvailableColumns(['region', 'city']);
    }
  }, [columnSelections]);

  const showRegionFilter = Array.isArray(availableColumns) ? availableColumns.includes('region') : true;
  const showCityFilter = Array.isArray(availableColumns) ? availableColumns.includes('city') : true;

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
          {showRegionFilter && (
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
          )}

          {showCityFilter && (
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
          )}
        </div>
      </div>
    </Card>
  );
}
