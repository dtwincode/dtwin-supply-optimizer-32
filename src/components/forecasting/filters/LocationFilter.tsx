
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
import { useEffect, useState } from "react";
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
  const [locationTypes, setLocationTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching location hierarchy...');
        const { data, error } = await supabase
          .from('location_hierarchy_view')
          .select('*')
          .eq('active', true)
          .order('hierarchy_level', { ascending: true });

        if (error) {
          console.error('Error fetching location hierarchy:', error);
          throw error;
        }

        if (data) {
          console.log('Location hierarchy data:', data);
          // Process location types
          const types = Array.from(new Set(data.map(item => item.location_type).filter(Boolean)));
          console.log('Location types:', types);
          setLocationTypes(types);

          // Build hierarchical structure
          const buildHierarchy = (parentId: string | null = null): LocationNode[] => {
            return data
              .filter(item => item.parent_id === parentId)
              .map(item => ({
                id: item.id,
                location_id: item.location_id,
                display_name: item.display_name || item.location_id,
                location_type: item.location_type,
                parent_id: item.parent_id,
                hierarchy_level: item.hierarchy_level,
                path: item.path,
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
      // Update based on location type
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

  // If no location types are found, show a message
  if (locationTypes.length === 0) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">
          No location hierarchy found. Please add locations in settings.
        </p>
      </div>
    );
  }

  const renderLocationLevel = (level: number, parentId: string | null = null) => {
    const locations = locationHierarchy.filter(loc => 
      loc.hierarchy_level === level && loc.parent_id === parentId
    );

    if (locations.length === 0) return null;

    const locationType = locations[0]?.location_type || `Level ${level}`;
    console.log(`Rendering ${locationType} level with ${locations.length} locations`);

    return (
      <Select
        key={`level-${level}`}
        value={selectedLocations[level] || "all"}
        onValueChange={(value) => handleLocationSelect(value, level)}
        disabled={level > 0 && !selectedLocations[level - 1]}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={`Select ${locationType}`} />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[200px]">
            <SelectItem value="all">All {locationType}s</SelectItem>
            {locations.map(location => (
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
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
      <div className="w-full">
        <h3 className="text-sm font-medium mb-2">Location Filters</h3>
        <div className="flex flex-wrap gap-4">
          {locationTypes.map((_, index) => renderLocationLevel(index))}
        </div>
      </div>
    </div>
  );
};
