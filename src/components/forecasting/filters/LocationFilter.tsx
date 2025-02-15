
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
  warehouse?: string;
  city?: string;
  region?: string;
  channel?: string;
  sub_channel?: string;
}

interface DatabaseLocationData {
  data: LocationData[];
}

export function LocationFilter({
  selectedFilters,
  onFilterChange,
}: LocationFilterProps) {
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: Set<string> }>({
    region: new Set(),
    city: new Set(),
    warehouse: new Set(),
    channel: new Set(),
    sub_channel: new Set(),
  });

  const { data: locationData, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_hierarchy')
        .select('warehouse, city, region, channel, sub_channel')
        .eq('active', true);

      if (error) {
        console.error('Error fetching location data:', error);
        return null;
      }

      return data as LocationData[];
    }
  });

  useEffect(() => {
    if (locationData) {
      const options: { [key: string]: Set<string> } = {
        region: new Set(),
        city: new Set(),
        warehouse: new Set(),
        channel: new Set(),
        sub_channel: new Set(),
      };

      locationData.forEach((location: LocationData) => {
        if (location.region) options.region.add(location.region);
        if (location.city) options.city.add(location.city);
        if (location.warehouse) options.warehouse.add(location.warehouse);
        if (location.channel) options.channel.add(location.channel);
        if (location.sub_channel) options.sub_channel.add(location.sub_channel);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Warehouse</label>
            <Select
              value={selectedFilters.warehouse || 'all'}
              onValueChange={(value) => onFilterChange('warehouse', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All warehouses</SelectItem>
                {Array.from(filterOptions.warehouse).sort().map((warehouse) => (
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
              value={selectedFilters.channel || 'all'}
              onValueChange={(value) => onFilterChange('channel', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                {Array.from(filterOptions.channel).sort().map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sub Channel</label>
            <Select
              value={selectedFilters.sub_channel || 'all'}
              onValueChange={(value) => onFilterChange('sub_channel', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select sub channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sub channels</SelectItem>
                {Array.from(filterOptions.sub_channel).sort().map((subChannel) => (
                  <SelectItem key={subChannel} value={subChannel}>
                    {subChannel}
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
