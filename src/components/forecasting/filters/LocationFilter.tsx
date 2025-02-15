
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

interface FilterValue {
  [key: string]: string;
}

export interface LocationFilterProps {
  selectedFilters: FilterValue;
  onFilterChange: (field: string, value: string) => void;
}

interface LocationData {
  [key: string]: string;
}

interface DatabaseLocationData {
  data: {
    data: LocationData[];
  };
  metadata?: {
    selected_columns?: string[];
  };
}

export function LocationFilter({
  selectedFilters,
  onFilterChange,
}: LocationFilterProps) {
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: Set<string> }>({
    region: new Set(['North', 'South', 'East', 'West']),
    city: new Set(['New York', 'Los Angeles', 'Chicago', 'Houston']),
  });

  // Fetch location data from Supabase
  const { data: locationData, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data: dbData, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('data, metadata')
        .eq('hierarchy_type', 'location')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching location data:', error);
        return null;
      }

      return dbData as DatabaseLocationData;
    }
  });

  useEffect(() => {
    if (locationData?.data?.data) {
      const options: { [key: string]: Set<string> } = {
        region: new Set(),
        city: new Set(),
      };

      locationData.data.data.forEach((location: LocationData) => {
        if (location.region) options.region.add(location.region);
        if (location.city) options.city.add(location.city);
      });

      setFilterOptions(options);
    }
  }, [locationData]);

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
              value={selectedFilters.region || 'all'}
              onValueChange={(value) => onFilterChange('region', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {Array.from(filterOptions.region).sort().map((region) => (
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
              value={selectedFilters.city || 'all'}
              onValueChange={(value) => onFilterChange('city', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {Array.from(filterOptions.city).sort().map((city) => (
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
