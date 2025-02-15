
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

      // Ensure we return an array of strings
      if (data?.selected_columns && Array.isArray(data.selected_columns)) {
        return data.selected_columns.filter(col => typeof col === 'string');
      }
      return defaultColumns;
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

      const hierarchyData = data?.data || [];
      console.log('Processed hierarchy data:', hierarchyData);
      
      // Only process columns that are selected in hierarchy settings
      const uniqueRegions = new Set<string>();
      const citiesByRegion: { [key: string]: Set<string> } = {};

      const selectedCols = Array.isArray(columnSelections) ? columnSelections : defaultColumns;
      console.log('Selected columns:', selectedCols);

      hierarchyData.forEach((row: LocationData) => {
        if (selectedCols.includes('region') && row.region) {
          uniqueRegions.add(row.region);
          if (selectedCols.includes('city') && row.city) {
            if (!citiesByRegion[row.region]) {
              citiesByRegion[row.region] = new Set<string>();
            }
            citiesByRegion[row.region].add(row.city);
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
    // Ensure columnSelections is an array before setting it
    if (Array.isArray(columnSelections)) {
      setAvailableColumns(columnSelections);
    } else {
      setAvailableColumns(defaultColumns);
    }
  }, [columnSelections]);

  // Ensure availableColumns is an array before using includes
  const showRegionFilter = Array.isArray(availableColumns) && availableColumns.includes('region');
  const showCityFilter = Array.isArray(availableColumns) && availableColumns.includes('city');

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
