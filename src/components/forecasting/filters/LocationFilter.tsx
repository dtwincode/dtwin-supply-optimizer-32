
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface LocationNode {
  id: string;
  location_id: string;
  display_name: string;
  location_type: string;
  parent_id: string | null;
  hierarchy_level: number;
  children?: LocationNode[];
  path: string[];
  active: boolean;
}

interface LocationFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  regions: string[];
  cities: { [key: string]: string[] };
}

export const LocationFilter = ({
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
}: LocationFilterProps) => {
  const [selectedLocations, setSelectedLocations] = useState<{ [key: string]: string }>({});

  // Fetch hierarchy mappings
  const { data: hierarchyMappings, isLoading: isMappingsLoading } = useQuery({
    queryKey: ['hierarchyMappings', 'location_hierarchy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hierarchy_column_mappings')
        .select('*')
        .eq('table_name', 'location_hierarchy')
        .order('hierarchy_level', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  // Fetch all location data
  const { data: locations, isLoading: isLocationsLoading } = useQuery({
    queryKey: ['allLocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_hierarchy_view')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      return data;
    }
  });

  // Process unique values for each hierarchy level
  const uniqueValues = useMemo(() => {
    if (!locations || !hierarchyMappings) return {};

    return hierarchyMappings.reduce((acc, mapping) => {
      if (!mapping.column_name || mapping.column_name === '') return acc;

      const columnName = mapping.column_name.toLowerCase();
      const uniqueSet = new Set(
        locations
          .map(loc => loc[columnName])
          .filter(Boolean) // Remove null/undefined values
      );

      acc[columnName] = Array.from(uniqueSet).sort();
      return acc;
    }, {} as { [key: string]: string[] });
  }, [locations, hierarchyMappings]);

  // Handle location selection
  const handleLocationSelect = (value: string, columnName: string) => {
    setSelectedLocations(prev => ({
      ...prev,
      [columnName]: value
    }));

    // Update parent component state if needed
    if (columnName === 'region') {
      setSelectedRegion(value);
    } else if (columnName === 'city') {
      setSelectedCity(value);
    }
  };

  if (isMappingsLoading || isLocationsLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
    );
  }

  // If no hierarchy mappings are found, show a message
  if (!hierarchyMappings?.length) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          No location hierarchy found. Please configure location hierarchy in settings.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="w-full">
        <h3 className="text-sm font-medium mb-2">Location Filters</h3>
        <div className="flex flex-wrap gap-4">
          {hierarchyMappings
            .filter(mapping => mapping.column_name && mapping.column_name !== '')
            .sort((a, b) => (a.hierarchy_level || 0) - (b.hierarchy_level || 0))
            .map((mapping) => {
              const columnName = mapping.column_name.toLowerCase();
              const values = uniqueValues[columnName] || [];
              const displayName = mapping.column_name
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

              return (
                <Select
                  key={columnName}
                  value={selectedLocations[columnName] || "all"}
                  onValueChange={(value) => handleLocationSelect(value, columnName)}
                  open={true}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={`Select ${displayName}`} />
                  </SelectTrigger>
                  <SelectContent 
                    position="popper" 
                    className="w-[200px] z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ScrollArea className="h-[200px]">
                      <SelectItem 
                        value="all"
                        onSelect={(e) => e.preventDefault()}
                      >
                        All {displayName}s
                      </SelectItem>
                      {values.map(value => (
                        <SelectItem 
                          key={value} 
                          value={value}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {value}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              );
            })}
        </div>
      </div>
    </div>
  );
};
