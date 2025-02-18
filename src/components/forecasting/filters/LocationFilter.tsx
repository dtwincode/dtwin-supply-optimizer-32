
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useFilters } from "@/contexts/FilterContext";
import { ArrowUpToLine, Trash2 } from "lucide-react";
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
    <div className="rounded-[32px] border border-[#F4F6F8] bg-white shadow-[0px_8px_16px_rgba(145,158,171,0.16)]">
      <div className="flex items-center justify-between border-b border-[#F4F6F8] px-8 py-6">
        <h2 className="text-[32px] font-bold text-[#2065D1]">Location Hierarchy</h2>
        <div className="flex items-center gap-3 text-[#637381]">
          <span className="text-[15px]">Click to collapse</span>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      {!hasData ? (
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#212B36]">Location Filters</h3>
              <p className="mt-2 text-[15px] text-[#637381]">Filter by location hierarchy</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-lg hover:bg-[#919EAB14]"
              >
                <ArrowUpToLine className="h-5 w-5 text-[#212B36]" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-lg hover:bg-[#919EAB14]"
              >
                <Trash2 className="h-5 w-5 text-[#212B36]" />
              </Button>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <p className="text-[22px] text-[#637381]">
              No active hierarchy. Please select a file to import.
            </p>
          </div>
        </div>
      ) : (
        <div className="px-8 py-6">
          {/* Will be populated when there's data */}
        </div>
      )}
    </div>
  );
}
