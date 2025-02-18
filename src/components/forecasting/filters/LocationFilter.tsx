
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useFilters } from "@/contexts/FilterContext";
import { ArrowDown, ArrowUpToLine, Trash2 } from "lucide-react";
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
    <div className="rounded-[20px] border bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-[26px] font-semibold text-[#2B66FF]">Location Hierarchy</h2>
        <div className="flex items-center gap-2 text-[#637381]">
          <span className="text-sm">Click to collapse</span>
          <ArrowDown className="h-4 w-4" />
        </div>
      </div>
      
      {!hasData ? (
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium text-[#212B36]">Location Filters</h3>
              <p className="mt-1.5 text-sm text-[#637381]">Filter by location hierarchy</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowUpToLine className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center text-center">
            <p className="text-[#637381] text-xl">
              No active hierarchy. Please select a file to import.
            </p>
          </div>
        </div>
      ) : (
        <div className="px-6 py-5">
          {/* This will be populated when there's data */}
        </div>
      )}
    </div>
  );
}
