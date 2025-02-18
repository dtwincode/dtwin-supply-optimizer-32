
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "react-router-dom";
import { useFilters } from "@/contexts/FilterContext";

interface LocationFilterData {
  [key: string]: string[];
}

export function LocationFilter() {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'analysis';
  const { getLocationState, setLocationState } = useFilters();

  const locationState = getLocationState(currentTab);

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
      
      // Ensure we always return an object, even if empty
      const hierarchyData = data?.data || {};
      
      // Validate that the data is in the correct format
      if (typeof hierarchyData !== 'object' || hierarchyData === null) {
        console.error('Invalid location hierarchy data format:', hierarchyData);
        return {};
      }

      // Convert the data into the expected format
      const formattedData: LocationFilterData = {};
      Object.entries(hierarchyData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formattedData[key] = value;
        } else {
          console.warn(`Invalid value format for key ${key}:`, value);
          formattedData[key] = [];
        }
      });

      return formattedData;
    }
  });

  const handleLocationChange = (level: string, value: string) => {
    setLocationState(currentTab, {
      ...locationState,
      [level]: value
    });
  };

  if (isLoading) {
    return <div>Loading locations...</div>;
  }

  // Ensure locationData is an object before trying to use Object.entries
  const entries = locationData ? Object.entries(locationData) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map(([level, values]) => (
        <div key={level} className="space-y-2">
          <label htmlFor={level} className="text-sm font-medium text-muted-foreground">
            {level}
          </label>
          <Select
            value={locationState[level] || ''}
            onValueChange={(value) => handleLocationChange(level, value)}
          >
            <SelectTrigger id={level}>
              <SelectValue placeholder={`Select ${level}`} />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(values) ? values.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              )) : null}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
