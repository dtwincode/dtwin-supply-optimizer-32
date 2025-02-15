
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
  region?: string;
  city?: string;
  warehouse?: string;
  channel?: string;
}

export function LocationFilter({
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
}: LocationFilterProps) {
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: Set<string> }>({
    region: new Set(),
    city: new Set(),
    warehouse: new Set(),
    channel: new Set(),
  });

  // Fetch location data
  const { data: locationData, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('data')
        .eq('hierarchy_type', 'location')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching location data:', error);
        return null;
      }

      // Parse the JSON data properly
      if (data?.data && typeof data.data === 'object' && 'data' in data.data) {
        return data.data;
      }

      return null;
    }
  });

  useEffect(() => {
    if (locationData?.data && Array.isArray(locationData.data)) {
      const options = {
        region: new Set<string>(),
        city: new Set<string>(),
        warehouse: new Set<string>(),
        channel: new Set<string>(),
      };

      locationData.data.forEach((location: LocationData) => {
        if (location.region) options.region.add(location.region);
        if (location.city) options.city.add(location.city);
        if (location.warehouse) options.warehouse.add(location.warehouse);
        if (location.channel) options.channel.add(location.channel);
      });

      setFilterOptions(options);
      console.log('Filter options updated:', options);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
              value={selectedCity}
              onValueChange={setSelectedCity}
            >
              <SelectTrigger>
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
