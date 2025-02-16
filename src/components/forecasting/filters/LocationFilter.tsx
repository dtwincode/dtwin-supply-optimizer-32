
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

type LocationData = Record<string, string | null>;

export function LocationFilter({
  selectedFilters,
  onFilterChange,
}: LocationFilterProps) {
  const navigate = useNavigate();
  const [filterColumns, setFilterColumns] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<Record<string, Set<string>>>({});

  const { data: locationData, isLoading, error } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      // First check if we have any configured columns
      const { data: columnSelections, error: columnError } = await supabase
        .from('hierarchy_column_selections')
        .select('selected_columns')
        .eq('table_name', 'location_hierarchy')
        .single();

      if (columnError) {
        if (columnError.code === 'PGRST116') {
          // No columns configured yet
          return { data: [], columns: [] };
        }
        console.error('Error fetching column selections:', columnError);
        return null;
      }

      if (!columnSelections?.selected_columns?.length) {
        return { data: [], columns: [] };
      }

      // Ensure column names match the database schema
      const validColumns = [
        'warehouse',
        'city',
        'region',
        'country',
        'channel',
        'sub_channel',
        'location_type',
        'location_id'
      ];

      const selectedColumns = columnSelections.selected_columns
        .map(col => col.toLowerCase())
        .filter(col => validColumns.includes(col));

      console.log('Selected valid columns:', selectedColumns);

      if (selectedColumns.length === 0) {
        return { data: [], columns: [] };
      }

      // Then fetch the location data with validated columns
      const { data: locationData, error: locationError } = await supabase
        .from('location_hierarchy')
        .select(selectedColumns.join(','));

      if (locationError) {
        console.error('Error fetching location data:', locationError);
        return null;
      }

      return { 
        data: locationData || [], 
        columns: selectedColumns 
      };
    }
  });

  useEffect(() => {
    if (locationData?.columns) {
      const { data, columns } = locationData;
      setFilterColumns(columns);
      
      // Initialize filter options
      const options: Record<string, Set<string>> = {};
      columns.forEach(column => {
        options[column] = new Set<string>();
      });

      // Populate filter options from the data
      data?.forEach((location: LocationData) => {
        columns.forEach(column => {
          const value = location[column];
          if (value) {
            options[column].add(value);
          }
        });
      });

      setFilterOptions(options);
    }
  }, [locationData]);

  if (locationData && (!locationData.data?.length || !locationData.columns?.length)) {
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
          {filterColumns.map(column => (
            <div key={column} className="space-y-2">
              <label className="text-sm font-medium capitalize">
                {column.replace(/_/g, ' ')}
              </label>
              <Select
                value={selectedFilters[column] || 'all'}
                onValueChange={(value) => onFilterChange(column, value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={`All ${column.replace(/_/g, ' ')}s`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All {column.replace(/_/g, ' ')}s
                  </SelectItem>
                  {Array.from(filterOptions[column] || []).sort().map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
