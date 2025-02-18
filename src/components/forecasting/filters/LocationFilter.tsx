
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useLocation } from "react-router-dom";

interface LocationFilterData {
  [key: string]: string[];
}

interface LocationState {
  [level: string]: string;
}

export function LocationFilter() {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'analysis';

  const [selectedLocations, setSelectedLocations] = useLocalStorage<LocationState>(
    `selectedLocations_${currentTab}`,
    {}
  );

  const { data: locationData, isLoading } = useQuery({
    queryKey: ['location-hierarchy', currentTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('data')
        .eq('hierarchy_type', 'location_hierarchy')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data?.data as LocationFilterData || {};
    }
  });

  const handleLocationChange = (level: string, value: string) => {
    setSelectedLocations(prev => ({
      ...prev,
      [level]: value
    }));
  };

  if (isLoading) {
    return <div>Loading locations...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(locationData || {}).map(([level, values]) => (
        <div key={level} className="space-y-2">
          <label htmlFor={level} className="text-sm font-medium text-muted-foreground">
            {level}
          </label>
          <Select
            value={selectedLocations[level] || ''}
            onValueChange={(value) => handleLocationChange(level, value)}
          >
            <SelectTrigger id={level}>
              <SelectValue placeholder={`Select ${level}`} />
            </SelectTrigger>
            <SelectContent>
              {values.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
