
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

interface LocationFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  regions: string[];
  cities: { [key: string]: string[] };
}

interface LocationData {
  [key: string]: string;
}

interface FilterValues {
  [key: string]: string;
}

export function LocationFilter({
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
  regions,
  cities,
}: LocationFilterProps) {
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: Set<string> }>({});

  // Fetch location data
  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('data')
        .eq('hierarchy_type', 'location')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching location data:', error);
        return null;
      }

      console.log('Raw location data:', data);
      return data;
    }
  });

  useEffect(() => {
    if (locationsData?.data && Array.isArray(locationsData.data)) {
      // Get all unique columns from the data
      const columns = new Set<string>();
      const options: { [key: string]: Set<string> } = {};

      // Initialize filter options
      locationsData.data.forEach((location: LocationData) => {
        Object.entries(location).forEach(([key, value]) => {
          // Add column to available columns
          columns.add(key);

          // Initialize or update options for this column
          if (!options[key]) {
            options[key] = new Set<string>();
          }
          if (value) {
            options[key].add(value);
          }
        });
      });

      setAvailableColumns(Array.from(columns).sort());
      setFilterOptions(options);

      // Initialize filter values
      const initialValues: FilterValues = {};
      columns.forEach(column => {
        initialValues[column] = 'all';
      });
      setFilterValues(initialValues);
    }
  }, [locationsData]);

  if (isLoadingLocations) {
    return (
      <Card className="p-6 w-full">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading filters...</p>
        </div>
      </Card>
    );
  }

  const handleFilterChange = (column: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [column]: value
    }));
  };

  return (
    <Card className="p-6 w-full">
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-4">Location Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableColumns.map((column) => (
            <div key={column} className="space-y-2">
              <label className="text-sm font-medium capitalize">
                {column.replace(/_/g, ' ')}
              </label>
              <Select
                value={filterValues[column] || 'all'}
                onValueChange={(value) => handleFilterChange(column, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${column.replace(/_/g, ' ')}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {column.replace(/_/g, ' ')}s</SelectItem>
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
