
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "react-router-dom";
import { useFilters } from "@/contexts/FilterContext";
import { ArrowDown, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  const handleClearFilters = () => {
    setLocationState(currentTab, {});
  };

  if (isLoading) {
    return <div>Loading locations...</div>;
  }

  const hasData = locationData && Object.keys(locationData).length > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-muted/50 rounded-lg">
        <p className="text-xl text-muted-foreground mb-2">No active hierarchy. Please select a file to import.</p>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1.5">
          <h3 className="font-medium text-base">Location Filters</h3>
          <p className="text-sm text-muted-foreground">Filter by location hierarchy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClearFilters}
            className="h-8 w-8"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        {Object.entries(locationData).map(([level, options]) => (
          <div key={level} className="grid gap-1.5">
            <label htmlFor={level} className="text-sm font-medium leading-none">
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
    </Card>
  );
}
