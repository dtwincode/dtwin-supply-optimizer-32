
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/contexts/I18nContext";
import { fetchLocationWithNames } from "@/lib/inventory-planning.service";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export interface InventoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedLocationId: string;
  setSelectedLocationId: (value: string) => void;
  priorityOnly?: boolean;
  setPriorityOnly?: (value: boolean) => void;
}

const InventoryFilters = ({
  searchQuery,
  setSearchQuery,
  selectedLocationId,
  setSelectedLocationId,
  priorityOnly = false,
  setPriorityOnly
}: InventoryFiltersProps) => {
  const { t } = useI18n();
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const locationData = await fetchLocationWithNames();
        
        setLocations([
          { id: 'all', name: 'All Locations' },
          ...locationData
        ]);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setLocations([
          { id: 'all', name: 'All Locations' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Input
        placeholder={t("common.inventory.searchProducts")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-64"
      />
      
      <Select
        value={selectedLocationId}
        onValueChange={setSelectedLocationId}
        disabled={loading}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={loading ? "Loading..." : t("common.inventory.allLocations")} />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={location.id}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {setPriorityOnly && (
        <div className="flex items-center space-x-2">
          <Switch 
            id="priority-filter" 
            checked={priorityOnly}
            onCheckedChange={setPriorityOnly}
          />
          <Label htmlFor="priority-filter" className="flex items-center cursor-pointer">
            <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
            Show Priority Items Only
          </Label>
        </div>
      )}
    </div>
  );
};

export default InventoryFilters;
