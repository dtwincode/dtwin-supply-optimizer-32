
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
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
  [key: string]: string | null;
  warehouse?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  channel?: string | null;
  sub_channel?: string | null;
  location_type?: string | null;
  location_id?: string | null;
}

export function LocationFilter({
  selectedFilters,
  onFilterChange,
}: LocationFilterProps) {
  const navigate = useNavigate();

  const { data: locationData } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data: permanentData, error: permanentError } = await supabase
        .from('permanent_hierarchy_data')
        .select('*')
        .eq('hierarchy_type', 'location')
        .eq('is_active', true)
        .single();

      if (permanentError || !permanentData) {
        return { data: [], columns: [] };
      }

      const { data: columnSelections } = await supabase
        .from('hierarchy_column_selections')
        .select('selected_columns')
        .eq('table_name', 'location_hierarchy')
        .single();

      if (!columnSelections?.selected_columns?.length) {
        return { data: [], columns: [] };
      }

      return { data: [], columns: [] };
    }
  });

  // Always show the upload prompt when there's no data
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
