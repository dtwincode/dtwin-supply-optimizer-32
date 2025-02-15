
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
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

const LOCATION_SELECTIONS_KEY = 'location_filter_selections';

export const LocationFilter = ({
  selectedRegion,
  setSelectedRegion,
  selectedCity,
  setSelectedCity,
}: LocationFilterProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [locationHierarchy, setLocationHierarchy] = useState<LocationNode[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() => {
    const savedSelections = localStorage.getItem(LOCATION_SELECTIONS_KEY);
    if (savedSelections) {
      const parsed = JSON.parse(savedSelections);
      // Immediately update parent filters with saved selections
      if (parsed[0] && parsed[0] !== 'all') setSelectedRegion(parsed[0]);
      if (parsed[1] && parsed[1] !== 'all') setSelectedCity(parsed[1]);
      return parsed;
    }
    return [selectedRegion !== 'all' ? selectedRegion : '', selectedCity !== 'all' ? selectedCity : ''];
  });
  const [hierarchyLevels, setHierarchyLevels] = useState<Array<{ level: number; type: string }>>([]);
  const { toast } = useToast();

  // Sync component state with props when they change
  useEffect(() => {
    const newSelections = [...selectedLocations];
    if (selectedRegion !== 'all' && selectedRegion !== selectedLocations[0]) {
      newSelections[0] = selectedRegion;
    }
    if (selectedCity !== 'all' && selectedCity !== selectedLocations[1]) {
      newSelections[1] = selectedCity;
    }
    setSelectedLocations(newSelections);
  }, [selectedRegion, selectedCity]);

  useEffect(() => {
    const fetchLocationHierarchy = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching location hierarchy...');
        
        const { data: mappings, error: mappingsError } = await supabase
          .from('hierarchy_column_mappings')
          .select('*')
          .eq('table_name', 'location_hierarchy')
          .order('hierarchy_level', { ascending: true })
          .limit(50);

        if (mappingsError) throw mappingsError;

        const { data: locations, error: locationsError } = await supabase
          .from('location_hierarchy_flat')
          .select('*')
          .order('hierarchy_level', { ascending: true })
          .limit(1000);

        if (locationsError) throw locationsError;

        if (locations && mappings) {
          console.log('Location hierarchy data:', locations);
          console.log('Hierarchy mappings:', mappings);

          const levels = mappings
            .filter(m => m.hierarchy_level !== null)
            .map(m => ({
              level: m.hierarchy_level,
              type: m.column_name
            }))
            .sort((a, b) => a.level - b.level);

          setHierarchyLevels(levels);

          const buildHierarchy = (parentId: string | null = null): LocationNode[] => {
            return locations
              .filter(item => item.parent_id === parentId)
              .map(item => ({
                id: item.id || '',
                location_id: item.location_id || '',
                display_name: item.display_name || item.location_id || '',
                location_type: item.location_type || '',
                parent_id: item.parent_id,
                hierarchy_level: item.hierarchy_level || 0,
                active: item.active || false,
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

  const handleSaveSelections = () => {
    localStorage.setItem(LOCATION_SELECTIONS_KEY, JSON.stringify(selectedLocations));
    // Also update parent filters to ensure immediate reflection
    if (selectedLocations[0]) {
      setSelectedRegion(selectedLocations[0]);
    }
    if (selectedLocations[1]) {
      setSelectedCity(selectedLocations[1]);
    }
    toast({
      title: "Selections saved",
      description: "Your location filters have been saved successfully.",
    });
  };

  const handleLocationSelect = (locationId: string, hierarchyLevel: number) => {
    const newSelections = selectedLocations.filter((_, index) => index < hierarchyLevel);
    if (locationId !== "all") {
      newSelections[hierarchyLevel] = locationId;
    }
    setSelectedLocations(newSelections);

    const locationNode = findLocationNode(locationHierarchy, locationId);
    if (locationNode) {
      switch (locationNode.location_type.toLowerCase()) {
        case 'region':
          setSelectedRegion(locationId);
          setSelectedCity('all'); // Reset city when region changes
          break;
        case 'city':
          setSelectedCity(locationId);
          break;
        default:
          break;
      }
    } else if (locationId === "all") {
      if (hierarchyLevel === 0) {
        setSelectedRegion('all');
        setSelectedCity('all');
      } else if (hierarchyLevel === 1) {
        setSelectedCity('all');
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Location Filters</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveSelections}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Selections
          </Button>
        </div>
        <div className="flex flex-wrap gap-4">
          {hierarchyLevels.map((level, index) => {
            const availableLocations = getAvailableLocations(index);
            const isDisabled = index > 0 && !selectedLocations[index - 1];
            const currentSelection = selectedLocations[index] || "all";

            return (
              <Select
                key={`level-${level.level}`}
                value={currentSelection}
                onValueChange={(value) => handleLocationSelect(value, index)}
                disabled={isDisabled}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={`Select ${level.type}`} />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    <SelectItem value="all" className="cursor-pointer">All {level.type}s</SelectItem>
                    {availableLocations.map(location => (
                      <SelectItem 
                        key={location.location_id} 
                        value={location.location_id}
                        className="cursor-pointer"
                      >
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
