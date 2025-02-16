
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
import { Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  country?: string;
  location_type?: string;
}

export function LocationFilter({
  selectedFilters,
  onFilterChange,
}: LocationFilterProps) {
  const navigate = useNavigate();
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: Set<string> }>({
    region: new Set(),
    city: new Set(),
    warehouse: new Set(),
    channel: new Set(),
    sub_channel: new Set(),
    country: new Set(),
    location_type: new Set(),
  });

  const { data: locationData, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      console.log('Fetching location data...');
      
      // First check for configured location hierarchy
      const { data: locationData, error: locationError } = await supabase
        .from('location_hierarchy')
        .select('warehouse, city, region, channel, sub_channel, country, location_type');

      if (locationError) {
        console.error('Error fetching location hierarchy:', locationError);
        return null;
      }

      if (locationData && locationData.length > 0) {
        return locationData as LocationData[];
      }

      // If no configured data, check for temporary uploads
      const { data: tempUploads, error: tempError } = await supabase
        .from('temp_hierarchy_uploads')
        .select('*')
        .eq('hierarchy_type', 'location')
        .eq('is_processed', false)
        .single();

      if (tempError) {
        if (tempError.code === 'PGRST116') {
          // No temporary upload found
          return [];
        }
        console.error('Error fetching temporary uploads:', tempError);
        return null;
      }

      // If we have temporary data, return it in the expected format
      if (tempUploads && tempUploads.data) {
        console.log('Found temporary upload:', tempUploads);
        return [];
      }

      return [];
    }
  });

  useEffect(() => {
    console.log('Location data in effect:', locationData);
    if (locationData) {
      const options: { [key: string]: Set<string> } = {
        region: new Set(),
        city: new Set(),
        warehouse: new Set(),
        channel: new Set(),
        sub_channel: new Set(),
        country: new Set(),
        location_type: new Set(),
      };

      locationData.forEach((location: LocationData) => {
        if (location.region) options.region.add(location.region);
        if (location.city) options.city.add(location.city);
        if (location.warehouse) options.warehouse.add(location.warehouse);
        if (location.channel) options.channel.add(location.channel);
        if (location.sub_channel) options.sub_channel.add(location.sub_channel);
        if (location.country) options.country.add(location.country);
        if (location.location_type) options.location_type.add(location.location_type);
      });

      console.log('Filter options after processing:', options);
      setFilterOptions(options);
    }
  }, [locationData]);

  // If there's no data yet, show a message directing user to upload data
  if (locationData && locationData.length === 0) {
    return (
      <Card className="p-6 w-full">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="font-semibold mb-1">No Location Data Configured</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please upload and configure your location hierarchy data in the settings
            </p>
            <Button 
              variant="outline"
              onClick={() => navigate('/settings')}
            >
              Go to Settings
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    console.error('Query error:', error);
    return (
      <Card className="p-6 w-full">
        <div className="text-red-500">Error loading location data</div>
      </Card>
    );
  }

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
          {/* Country Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Select
              value={selectedFilters.country || 'all'}
              onValueChange={(value) => onFilterChange('country', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {Array.from(filterOptions.country).sort().map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Region</label>
            <Select
              value={selectedFilters.region || 'all'}
              onValueChange={(value) => onFilterChange('region', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All regions" />
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

          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Select
              value={selectedFilters.city || 'all'}
              onValueChange={(value) => onFilterChange('city', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All cities" />
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

          {/* Location Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location Type</label>
            <Select
              value={selectedFilters.location_type || 'all'}
              onValueChange={(value) => onFilterChange('location_type', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All location types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All location types</SelectItem>
                {Array.from(filterOptions.location_type).sort().map((locationType) => (
                  <SelectItem key={locationType} value={locationType}>
                    {locationType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warehouse Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Warehouse</label>
            <Select
              value={selectedFilters.warehouse || 'all'}
              onValueChange={(value) => onFilterChange('warehouse', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All warehouses" />
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

          {/* Channel Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Channel</label>
            <Select
              value={selectedFilters.channel || 'all'}
              onValueChange={(value) => onFilterChange('channel', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All channels" />
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

          {/* Sub Channel Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sub Channel</label>
            <Select
              value={selectedFilters.sub_channel || 'all'}
              onValueChange={(value) => onFilterChange('sub_channel', value)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All sub channels" />
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
