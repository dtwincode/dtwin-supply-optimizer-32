
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
      
      // Ensure we handle the data properly
      const hierarchyData = data?.data || {};
      
      // Convert the data into the expected format and validate arrays
      const formattedData: LocationFilterData = {};
      Object.entries(hierarchyData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formattedData[key] = value;
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

  if (!locationData) {
    return null;
  }

  return (
    <div className="space-y-4">
      {Object.entries(locationData).map(([level, options], index) => (
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
              {Array.isArray(options) && options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
