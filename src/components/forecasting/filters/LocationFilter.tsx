
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
import { Loader2 } from "lucide-react";

interface FilterValue {
  [key: string]: string;
}

interface LocationFilterProps {
  selectedFilters: FilterValue;
  onFilterChange: (field: string, value: string) => void;
}

interface LocationData {
  [key: string]: string;
}

interface DatabaseLocationData {
  data: {
    data: LocationData[];
  };
  metadata?: {
    selected_columns?: string[];
  };
}

export function LocationFilter({
  selectedFilters,
  onFilterChange,
}: LocationFilterProps) {
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: Set<string> }>({});
  const [columns, setColumns] = useState<string[]>([]);

  // Fetch location data and column configuration from permanent_hierarchy_data
  const { data: locationData, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data: dbData, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('data, metadata')
        .eq('hierarchy_type', 'location')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching location data:', error);
        return null;
      }

      return dbData as DatabaseLocationData;
    }
  });

  useEffect(() => {
    if (locationData?.data?.data && locationData.metadata?.selected_columns) {
      const options: { [key: string]: Set<string> } = {};
      const selectedColumns = locationData.metadata.selected_columns;
      
      // Initialize Sets for each column
      selectedColumns.forEach(column => {
        options[column] = new Set<string>();
      });

      // Populate the Sets with values
      locationData.data.data.forEach((location: LocationData) => {
        selectedColumns.forEach(column => {
          if (location[column]) {
            options[column].add(location[column]);
          }
        });
      });

      setFilterOptions(options);
      setColumns(selectedColumns);
      console.log('Filter options updated:', options);
    }
  }, [locationData]);

  // Get filtered options for a specific column based on current selections
  const getFilteredOptions = (column: string): string[] => {
    if (!locationData?.data?.data) return [];

    return Array.from(filterOptions[column] || []).filter(value => {
      // Check if this value is valid given the current filter selections
      return locationData.data.data.some(location => {
        // Check if this location matches all currently selected filters
        for (const [key, selectedValue] of Object.entries(selectedFilters)) {
          if (selectedValue !== 'all' && location[key] !== selectedValue) {
            return false;
          }
        }
        return location[column] === value;
      });
    });
  };

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
          {columns.map((column) => (
            <div key={column} className="space-y-2">
              <label className="text-sm font-medium capitalize">
                {column.replace(/_/g, ' ')}
              </label>
              <Select
                value={selectedFilters[column] || 'all'}
                onValueChange={(value) => onFilterChange(column, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${column.replace(/_/g, ' ')}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {column.replace(/_/g, ' ')}</SelectItem>
                  {getFilteredOptions(column).sort().map((value) => (
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
