
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useFilters } from "@/contexts/FilterContext";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationFilterData {
  [key: string]: string[];
}

export function LocationFilter() {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'analysis';
  const { getLocationState, setLocationState } = useFilters();

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
      
      const hierarchyData = data?.data || {};
      const formattedData: LocationFilterData = {};
      Object.entries(hierarchyData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formattedData[key] = value;
        }
      });

      return formattedData;
    }
  });

  if (isLoading) {
    return <div>Loading locations...</div>;
  }

  const hasData = locationData && Object.keys(locationData).length > 0;

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-xl font-semibold text-primary">Location Hierarchy</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Click to collapse</span>
          <ArrowDown className="h-4 w-4" />
        </div>
      </div>
      
      {!hasData && (
        <div className="flex flex-col items-center justify-center p-24 text-center">
          <p className="mb-8 text-2xl text-muted-foreground">
            No active hierarchy. Please select a file to import.
          </p>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            Import
          </Button>
        </div>
      )}
    </div>
  );
}
