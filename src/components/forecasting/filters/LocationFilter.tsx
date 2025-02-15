
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
  selectedWarehouse?: string;
  setSelectedWarehouse?: (warehouse: string) => void;
  selectedChannel?: string;
  setSelectedChannel?: (channel: string) => void;
  regions: string[];
  cities: { [key: string]: string[] };
}

interface LocationData {
  region?: string;
  city?: string;
  warehouse?: string;
  channel?: string;
}

interface DatabaseLocationData {
  data: {
    data: LocationData[];
  }
}

export function LocationFilter({
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
  selectedWarehouse = 'all',
  setSelectedWarehouse = () => {},
  selectedChannel = 'all',
  setSelectedChannel = () => {},
}: LocationFilterProps) {
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: Set<string> }>({
    region: new Set(),
    city: new Set(),
    warehouse: new Set(),
    channel: new Set(),
  });

  // Fetch location data from permanent_hierarchy_data
  const { data: locationData, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data: dbData, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('data')
        .eq('hierarchy_type', 'location')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching location data:', error);
        return null;
      }

      // First cast to unknown, then validate the structure
      const rawData = dbData as unknown;
      
      // Type guard function to validate LocationData
      const isLocationData = (item: any): item is LocationData => {
        return typeof item === 'object' && item !== null;
      };

      // Validate the data structure
      if (rawData && 
          typeof rawData === 'object' && 
          'data' in rawData && 
          typeof rawData.data === 'object' &&
          rawData.data !== null &&
          'data' in rawData.data &&
          Array.isArray(rawData.data.data) &&
          rawData.data.data.every(isLocationData)) {
        return rawData as DatabaseLocationData;
      }

      return null;
    }
  });

  useEffect(() => {
    if (locationData?.data?.data) {
      const options = {
        region: new Set<string>(),
        city: new Set<string>(),
        warehouse: new Set<string>(),
        channel: new Set<string>(),
      };

      const locations = locationData.data.data;
      
      locations.forEach((location: LocationData) => {
        if (location.region) options.region.add(location.region);
        if (location.city) options.city.add(location.city);
        if (location.warehouse) options.warehouse.add(location.warehouse);
        if (location.channel) options.channel.add(location.channel);
      });

      setFilterOptions(options);
      console.log('Filter options updated:', options);
    }
  }, [locationData]);

  // Filter cities based on selected region
  const filteredCities = Array.from(filterOptions.city).filter((city) => {
    if (selectedRegion === 'all') return true;
    return locationData?.data?.data.some(
      (location) => location.city === city && location.region === selectedRegion
    );
  });

  // Filter warehouses based on selected city
  const filteredWarehouses = Array.from(filterOptions.warehouse).filter((warehouse) => {
    if (selectedCity === 'all') return true;
    return locationData?.data?.data.some(
      (location) => location.warehouse === warehouse && location.city === selectedCity
    );
  });

  // Filter channels based on selected warehouse
  const filteredChannels = Array.from(filterOptions.channel).filter((channel) => {
    if (selectedWarehouse === 'all') return true;
    return locationData?.data?.data.some(
      (location) => location.channel === channel && location.warehouse === selectedWarehouse
    );
  });

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                {filteredCities.sort().map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Warehouse</label>
            <Select
              value={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All warehouses</SelectItem>
                {filteredWarehouses.sort().map((warehouse) => (
                  <SelectItem key={warehouse} value={warehouse}>
                    {warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Channel</label>
            <Select
              value={selectedChannel}
              onValueChange={setSelectedChannel}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                {filteredChannels.sort().map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
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
