
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LocationNode {
  id: string;
  location_id: string;
  display_name: string;
  location_type: string;
  parent_id: string | null;
  hierarchy_level: number;
  children?: LocationNode[];
  path: string[];
  active: boolean;
}

interface LocationFilterProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  regions: string[];
  cities: { [key: string]: string[] };
}

export const LocationFilter = ({
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
}: LocationFilterProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [locationHierarchy, setLocationHierarchy] = useState<LocationNode[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [hierarchyLevels, setHierarchyLevels] = useState<Array<{ level: number; type: string }>>([]);

  // Fetch location hierarchy and mappings
  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching location hierarchy...');
        
        // First get the hierarchy mappings
        const { data: mappings, error: mappingsError } = await supabase
          .from('hierarchy_column_mappings')
          .select('*')
          .eq('table_name', 'location_hierarchy')
          .order('hierarchy_level', { ascending: true });

        if (mappingsError) throw mappingsError;

        // Then get the location hierarchy data
        const { data: locations, error: locationsError } = await supabase
          .from('location_hierarchy_view')
          .select('*')
          .eq('active', true)
          .order('hierarchy_level', { ascending: true });

        if (locationsError) throw locationsError;

        if (locations && mappings) {
          console.log('Location hierarchy data:', locations);
          console.log('Hierarchy mappings:', mappings);

          // Process hierarchy levels from mappings
          const levels = mappings
            .filter(m => m.hierarchy_level !== null)
            .map(m => ({
              level: m.hierarchy_level,
              type: m.column_name
            }))
            .sort((a, b) => a.level - b.level);

          setHierarchyLevels(levels);

          // Build hierarchical structure
          const buildHierarchy = (parentId: string | null = null): LocationNode[] => {
            return locations
              .filter(item => item.parent_id === parentId)
              .map(item => ({
                id: item.id,
                location_id: item.location_id,
                display_name: item.display_name || item.location_id,
                location_type: item.location_type,
                parent_id: item.parent_id,
                hierarchy_level: item.hierarchy_level,
                path: item.path || [],
                active: item.active,
                children: buildHierarchy(item.location_id)
              }));
          };

          const hierarchy = buildHierarchy();
          console.log('Built hierarchy:', hierarchy);
          setLocationHierarchy(hierarchy);
        }
      } catch (error) {
        console.error('Error fetching location hierarchy:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationHierarchy();
  }, []);

  const handleLocationSelect = (locationId: string, hierarchyLevel: number) => {
    // Clear selections at and below the current hierarchy level
    const newSelections = selectedLocations.filter((_, index) => index < hierarchyLevel);
    
    // Add the new selection if it's not "all"
    if (locationId !== "all") {
      newSelections[hierarchyLevel] = locationId;
    }
    
    setSelectedLocations(newSelections);

    // Update region and city based on the selections
    const locationNode = findLocationNode(locationHierarchy, locationId);
    if (locationNode) {
      switch (locationNode.location_type.toLowerCase()) {
        case 'region':
          setSelectedRegion(locationId);
          setSelectedCity('all');
          break;
        case 'city':
          setSelectedCity(locationId);
          break;
        default:
          break;
      }
    }
  };

  const getAvailableLocations = (level: number) => {
    if (level === 0) return locationHierarchy;

    const parentSelection = selectedLocations[level - 1];
    if (!parentSelection) return [];

    const findChildren = (nodes: LocationNode[]): LocationNode[] => {
      for (const node of nodes) {
        if (node.location_id === parentSelection) {
          return node.children || [];
        }
        if (node.children) {
          const found = findChildren(node.children);
          if (found.length > 0) return found;
        }
      }
      return [];
    };

    return findChildren(locationHierarchy);
  };

  const findLocationNode = (nodes: LocationNode[], locationId: string): LocationNode | null => {
    for (const node of nodes) {
      if (node.location_id === locationId) return node;
      if (node.children) {
        const found = findLocationNode(node.children, locationId);
        if (found) return found;
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
    );
  }

  // If no hierarchy levels are found, show a message
  if (hierarchyLevels.length === 0) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          No location hierarchy found. Please configure location hierarchy in settings.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="w-full">
        <h3 className="text-sm font-medium mb-2">Location Filters</h3>
        <div className="flex flex-wrap gap-4">
          {hierarchyLevels.map((level, index) => {
            const availableLocations = getAvailableLocations(index);
            const isDisabled = index > 0 && !selectedLocations[index - 1];

            return (
              <Select
                key={`level-${level.level}`}
                value={selectedLocations[index] || "all"}
                onValueChange={(value) => handleLocationSelect(value, index)}
                disabled={isDisabled}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={`Select ${level.type}`} />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    <SelectItem value="all">All {level.type}s</SelectItem>
                    {availableLocations.map(location => (
                      <SelectItem key={location.location_id} value={location.location_id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{location.display_name}</span>
                          {location.children?.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {location.children.length}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            );
          })}
        </div>
      </div>
    </div>
  );
};
